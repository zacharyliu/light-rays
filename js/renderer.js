var Renderer = function (canvas) {
  let self = this;

  this.canvas = canvas;

  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.bottom = '0px';
  document.body.appendChild(this.stats.domElement);

  this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, preserveDrawingBuffer: true, alpha: true});

  this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
  // this.camera = new THREE.OrthographicCamera(GameState.WIDTH / -2, GameState.WIDTH / 2, GameState.HEIGHT / 2, GameState.HEIGHT / -2, 1, 1000);
  this._setCameraAngle(0.5);

  this.camera2 = this.camera.clone();
  this.camera2.position = this.camera.position;
  this.camera2.rotation = this.camera.rotation;

  // this.cameraControls = new THREE.TrackballControls(this.camera, canvas);

  window.addEventListener('resize', function () {
    self.resize();
  });
};

Renderer.prototype.createGradient = function(scene) {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;
  var context = canvas.getContext( '2d' );
  var gradient = context.createLinearGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2);
  gradient.addColorStop( 0, '#EAECC6' );
  gradient.addColorStop( 1, '#2BC0E4' );
  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );
  var shadowTexture = new THREE.Texture( canvas );
  shadowTexture.needsUpdate = true;
  var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
  var shadowGeo = new THREE.PlaneGeometry( GameState.HEIGHT * 1.5, GameState.WIDTH * 1.8, 1, 1 );

  let mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
  mesh.position.set(GameState.WIDTH / 2, GameState.HEIGHT / 2, 10);
  mesh.rotation.set(-Math.PI, 0, Math.PI/2);
  scene.add( mesh );
};

Renderer.prototype._setCameraAngle = function (theta) {
  let fov = this.camera.fov / 180 * Math.PI;
  let d = GameState.HEIGHT / (Math.tan(fov / 2 + theta) + Math.tan(fov / 2 - theta));
  let h = d * Math.tan(Math.PI / 8 + theta);
  this.camera.position.set(GameState.WIDTH / 2, h, -d);
  this.camera.rotation.set(Math.PI + theta, 0, 0);
};

Renderer.prototype.initScene = function (scene, effectsScene) {
  this.scene = scene;

  // this.createGradient(scene);

  // multi-pass technique based on: https://stemkoski.github.io/Three.js/Selective-Glow.html

  // prepare secondary composer
  var renderTargetParameters = {
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat, stencilBuffer: false
  };
  this.renderTarget = new THREE.WebGLRenderTarget(GameState.WIDTH, GameState.HEIGHT, renderTargetParameters);
  this.effectsComposer = new THREE.EffectComposer(this.renderer, this.renderTarget);

  // prepare the secondary render's passes
  var render2Pass = new THREE.RenderPass(effectsScene, this.camera);
  this.effectsComposer.addPass(render2Pass);

  // special effects to be applied to secondary render:
  this.effectsComposer.addPass(new THREE.BloomPass(1, 25, 4.0, 256));

  this.composer = new THREE.EffectComposer( this.renderer );

  this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

  var effectBlend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse1" );
  effectBlend.uniforms[ 'tDiffuse2' ].value = this.effectsComposer.renderTarget2;
  this.composer.addPass( effectBlend );

  this.fxaa = new THREE.ShaderPass(THREE.FXAAShader);
  this.fxaa.renderToScreen = true;
  this.composer.addPass(this.fxaa);

  scene.add(this.camera);
  effectsScene.add(this.camera2);
};

Renderer.prototype.render = function () {
  this.cameraControls && this.cameraControls.update();
  this.effectsComposer.render();
  this.composer.render();
  this.stats.update();
};

Renderer.prototype.resize = function () {
  let width = window.innerWidth;
  let height = window.innerHeight;

  this.camera.left = width / -2;
  this.camera.right = width / 2;
  this.camera.top = height / 2;
  this.camera.bottom = height / -2;

  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  // Camera position updates on its own with orthographic perspective
  // this.camera.position.x = width / 2;
  // this.camera.position.y = height / 2;

  // FIXME: THREE.EffectsComposer is incompatible with pixel ratio
  // this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(width, height);

  this.composer.setSize(width, height);
  this.effectsComposer.setSize(width, height);

  this.fxaa.uniforms.resolution.value.set(1 / width, 1 / height);
};
