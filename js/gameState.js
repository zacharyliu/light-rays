var GameState = function () {
  // mouse state
  this.mouseIsDown = false;

  // TODO: Increase velocity as game progresses (level system?)
  this.velocity = new THREE.Vector3(0, 50, 0);

  // {type: string, body: instanceof THREE.Object3D}
  this.gameObjects = [];

  this.lightRay = new LightRay(new THREE.Ray(new THREE.Vector3(GameState.WIDTH/2, GameState.HEIGHT, 0), new THREE.Vector3(-1, -2, 0).normalize()));

  this.scene = new THREE.Scene();
  this.scene.add(this.lightRay.body);

  this.walls = [
    new Mirror({
      length: GameState.HEIGHT,
      position: new THREE.Vector3(0, GameState.HEIGHT / 2, 0)
    }),
    new Mirror({
      length: GameState.HEIGHT,
      position: new THREE.Vector3(GameState.WIDTH, GameState.HEIGHT / 2, 0)
    })
  ];
  for (var wall of this.walls) this.scene.add(wall.body);

  this.collider = new Collider();

  this._initLights();

  this.reset();
};

GameState.WIDTH = 320;

GameState.HEIGHT = 480;

GameState.BOUNDING_BOX = new THREE.Box3(new THREE.Vector3(0, 0, -1000), new THREE.Vector3(GameState.WIDTH, GameState.HEIGHT, 1000));

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
    angle: Math.random() * 2 * Math.PI,
    velocity: this.velocity
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

  for (let obj of this.gameObjects) obj.update(dt);

  this.collider.collide(this.lightRay, [].concat(this.gameObjects, this.walls));

  // Clear dead game objects (below screen and not colliding)
  for (let i = this.gameObjects.length - 1; i >= 0; i--) {
    let obj = this.gameObjects[i];
    if (!obj.isColliding && !GameState.BOUNDING_BOX.intersectsBox(new THREE.Box3().setFromObject(obj.body))) {
      this.scene.remove(obj.body);
      this.gameObjects.splice(i, 1);
    }
  }
};

// Reset game to original state
GameState.prototype.reset = function () {
  // this.lightRay = 
  this.gameObjects = [];
  this.rayCollisions = [];
};
