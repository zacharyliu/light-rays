var GameState = function (width, height) {
  this.width = width;
  this.height = height;

  // mouse state
  this.mouseIsDown = false;

  // {type: string, body: instanceof THREE.Object3D}
  this.gameObjects = [];

  this.lightRay = new LightRay(new THREE.Ray(new THREE.Vector3(width/2, height/2, 0), new THREE.Vector3(-1, -2, 0).normalize()));

  this.scene = new THREE.Scene();
  this.scene.add(this.lightRay.body);

  this.walls = [
    new Mirror({
      length: height,
      position: new THREE.Vector3(0, height / 2, 0)
    }),
    new Mirror({
      length: height,
      position: new THREE.Vector3(width, height / 2, 0)
    })
  ];
  for (var wall of this.walls) this.scene.add(wall.body);

  this.collider = new Collider();

  this._initLights();

  this.reset();
};

GameState.prototype._initLights = function () {
  var light1 = new THREE.AmbientLight(Math.random() * 0xffffff);
  this.scene.add(light1);

  var light2 = new THREE.DirectionalLight(Math.random() * 0xffffff);
  light2.position.set(Math.random(), Math.random(), Math.random()).normalize();
  this.scene.add(light2);
};

GameState.prototype._placeMirror = function(x, y) {
  var mirror = new Mirror({
    length: 35 + Math.random() * 30,
    position: new THREE.Vector3(x, y, 0),
    angle: Math.random() * 2 * Math.PI
  });
  
  if (mirror.hasIntersection(this.gameObjects)) {
    // don't place the box
    return false;
  }
  
  this.gameObjects.push(mirror);
  this.scene.add(mirror.body);
  return true;
}

// Update game objects.
// We'll use GameInput to detect which keys are down.
// If you look at the bottom of index.html, we load GameInput
// from js/input.js right before app.js
GameState.prototype.update = function (dt) {
  // You can pass any letter to `isDown`, in addition to DOWN,
  // UP, LEFT, RIGHT, and SPACE:
  // if(GameInput.isDown('a')) { ... }
  var isDown = GameInput.isDown('MOUSE');
  if (isDown) {
    if (this.mouseIsDown) {
      // hold
    }
    else {
      // down
      var mousePos = GameInput.getMousePos();
      this._placeMirror(mousePos.x, mousePos.y);
    }
  }
  else {
    if (this.mouseIsDown) {
      // up
    }
    else {
      // no input
    }
  }
  this.mouseIsDown = isDown;

  this.lightRay.update(dt);
  for (var obj of this.gameObjects) obj.update();

  this.collider.collide(this.lightRay, [].concat(this.gameObjects, this.walls));
};

// Reset game to original state
GameState.prototype.reset = function () {
  // this.lightRay = 
  this.gameObjects = [];
  this.rayCollisions = [];
};
