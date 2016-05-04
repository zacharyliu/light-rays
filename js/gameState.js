var GameState = function (width, height) {
  this.width = width;
  this.height = height;

  // mouse state
  this.mouseIsDown = false;

  // {type: string, body: instanceof THREE.Object3D}
  this.gameObjects = [];
  
  // expecting THREE.Ray
  this.lightRay = new THREE.Ray(new THREE.Vector3(width/2, height, 0), new THREE.Vector3(-1, -2, 0));

  // {x: float, y: float, type: string}
  this.rayCollisions = [{x: 47, y: 45, type: 'mirror'}, {x: 65, y: 26, type: 'obstacle'}, {x: 98, y: 99, type: 'top'}];
  
  this.reset();
};

GameState.prototype._placeMirror = function(x, y) {
  var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  object.position.x = x;
  object.position.y = y;
  object.position.z = 0;
  // object.rotation.x = Math.random() * 2 * Math.PI;
  // object.rotation.y = Math.random() * 2 * Math.PI;
  // object.rotation.z = Math.random() * 2 * Math.PI;
  //
  var bbox = new THREE.Box3().setFromObject(object);
  var hasIntersection = false;
  this.gameObjects.forEach(function(elem, i) {
    var bboxOther = new THREE.Box3().setFromObject(elem.body);
    hasIntersection = hasIntersection || bbox.intersectsBox(bboxOther);
  });
  if (hasIntersection) {
    // don't place the box
    return false;
  }
  //
  this.gameObjects.push({
    type: 'mirror',
    body: object
  });
  console.log(x+ " " +y);
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
};

// Reset game to original state
GameState.prototype.reset = function () {
  // this.lightRay = 
  this.gameObjects = [];
  this.rayCollisions = [];
};
