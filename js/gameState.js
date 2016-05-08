var GameState = function () {
  // mouse state
  this.mouseIsDown = false;
  this.mouseRaycaster  = new THREE.Raycaster();
  this.mouseOverObject = null;

  // TODO: Increase velocity as game progresses (level system?)
  this.velocity = new THREE.Vector3(0, 50, 0);

  // {type: string, body: instanceof THREE.Object3D}
  this.gameObjects = [];

  this.lightRay = new LightRay(new THREE.Ray(new THREE.Vector3(GameState.WIDTH/2, GameState.HEIGHT, 0), new THREE.Vector3(-1, -2, 0).normalize()), this.velocity);

  this.scene = new THREE.Scene();
  this.scene.add(this.lightRay.body, this.lightRay.particleSystem);

  this.effectsScene = new THREE.Scene();
  // Add light ray as child without removing from main scene
  this.effectsScene.children.push(this.lightRay.body);

  this.walls = [
    new Mirror({
      length: GameState.HEIGHT * 2,
      position: new THREE.Vector3(0, GameState.HEIGHT, 0)
    }),
    new Mirror({
      length: GameState.HEIGHT * 2,
      position: new THREE.Vector3(GameState.WIDTH, GameState.HEIGHT, 0)
    })
  ];
  for (var wall of this.walls) this.scene.add(wall.body);

  this.ceiling = GameObject.createBox(GameState.WIDTH, 0, new THREE.Vector3(GameState.WIDTH / 2, 0, 0));
  this.scene.add(this.ceiling.body);

  this.floor = GameObject.createBox(GameState.WIDTH, 0, new THREE.Vector3(GameState.WIDTH / 2, GameState.HEIGHT, 0));
  this.scene.add(this.floor.body);

  this.collider = new Collider();
  
  this.timeSinceLastObstacle = Number.POSITIVE_INFINITY;

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
    length: 50,
    position: new THREE.Vector3(x, y, 0),
    angle: Math.random() * 2 * Math.PI,
    velocity: this.velocity
  });
  
  if (mirror.hasIntersection(this.gameObjects)) {
    // don't place the box
    return false;
  }

  mirror.setState(Mirror.State.SELECTED);
  
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
      if (!this.mouseOverObject) this._placeMirror(mousePos.x, mousePos.y);
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
  
  // Spawn obstacles
  this.timeSinceLastObstacle += dt;
  if (this.timeSinceLastObstacle > 2) {
    this.timeSinceLastObstacle = 0;
    let obstacle = new FilterObstacle({
      width: 100,
      height: 10,
      position: new THREE.Vector3(Math.random() * GameState.WIDTH, 0, 0),
      velocity: this.velocity
    });
    this.gameObjects.push(obstacle);
    this.scene.add(obstacle.body);
  }

  GameInput.updateRaycaster(this.mouseRaycaster);

  // based on: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_ortho.html
  let intersects = this.mouseRaycaster.intersectObjects(this.gameObjects.map(e => e.mouseOverBody));
  if (intersects.length > 0) {
    let obj = intersects[0].object.userData.entity;
    if (this.mouseOverObject != obj) {
      if (this.mouseOverObject) this.mouseOverObject.isMouseOver = false;
      this.mouseOverObject = obj;
      this.mouseOverObject.isMouseOver = true;
    }
  } else {
    if (this.mouseOverObject) this.mouseOverObject.isMouseOver = false;
    this.mouseOverObject = null;
  }

  this.lightRay.update(dt);

  var collideObjects = [].concat(this.gameObjects, this.walls);
  collideObjects.push(this.ceiling, this.floor);

  for (let obj of collideObjects) obj.update(dt);
  this.collider.collide(this.lightRay, collideObjects);

  // Clear dead game objects (below screen and not colliding)
  for (let i = this.gameObjects.length - 1; i >= 0; i--) {
    let obj = this.gameObjects[i];
    if (!obj.isColliding && !GameState.BOUNDING_BOX.intersectsBox(new THREE.Box3().setFromObject(obj.body))) {
      this.scene.remove(obj.body);
      this.gameObjects.splice(i, 1);
    }
  }

  // Move light ray origin back to bottom of scene
  if (this.floor.isColliding) {
    let intersection = this.floor.intersections[0];
    this.lightRay.ray = intersection.ray;
    this.lightRay.color = intersection.color;
  } else {
    // TODO: game over state - light ray left the scene
  }
};

// Reset game to original state
GameState.prototype.reset = function () {
  // this.lightRay = 
  this.gameObjects = [];
  this.rayCollisions = [];
};
