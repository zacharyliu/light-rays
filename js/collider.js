var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.prototype.collide = function (gameState) {
  var ray = gameState.lightRay.ray;
  var gameObjects = gameState.gameObjects;

  this.raycaster.set(ray.origin, ray.direction);
  var intersections = this.raycaster.intersectObjects(gameObjects.map(function (e) {
    return e.body;
  }));
  gameState.lightRay.updateRayCollisions(intersections);
};
