var Renderer = function (canvas) {
  this.canvas = canvas;

  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.bottom = '0px';
  document.body.appendChild(this.stats.domElement);

  this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, preserveDrawingBuffer: true});
  this.renderer.setClearColor(0x444444);

  // this.camera = new THREE.PerspectiveCamera(35, canvas.width / canvas.height, 1, 10000);
  this.camera = new THREE.OrthographicCamera(GameState.WIDTH / -2, GameState.WIDTH / 2, GameState.HEIGHT / 2, GameState.HEIGHT / -2, 1, 1000);
  this.camera.position.set(GameState.WIDTH / 2, GameState.HEIGHT / 2, -100);
  this.camera.rotation.set(Math.PI, 0, 0);

  // this.cameraControls = new THREE.TrackballControls(this.camera, canvas);
};

Renderer.prototype.initScene = function (scene) {
  scene.add(this.camera);
};

Renderer.prototype.render = function (scene) {
  this.cameraControls && this.cameraControls.update();
  this.renderer.render(scene, this.camera);
  this.stats.update();
};

Renderer.prototype.resize = function (width, height) {
  this.camera.left = width / -2;
  this.camera.right = width / 2;
  this.camera.top = height / 2;
  this.camera.bottom = height / -2;

  // Camera position updates on its own with orthographic perspective
  // this.camera.position.x = width / 2;
  // this.camera.position.y = height / 2;

  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(width, height);
};
