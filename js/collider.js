var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.prototype.collide = function (gameState) {
  var ray = gameState.lightRay.ray;
  var gameObjects = gameState.gameObjects;
  var intersections = [];

  var doRaycast = true;
  while (doRaycast) {
    doRaycast = false;
    this.raycaster.set(ray.origin, ray.direction);
    var result = this.raycaster.intersectObjects(gameObjects.map(function (e) {
      return e.body;
    }));
    for (var intersection of result) {
      intersections.push(intersection);
      var reflectIntersection = intersection.object.userData.entity.reflectIntersection;
      var newRay;
      if (reflectIntersection && (newRay = reflectIntersection(ray, intersection))) {
        ray = newRay;
        this.raycaster.set(ray.origin, ray.direction);
        doRaycast = true;
        break;
      }
    }
  }

  gameState.lightRay.updateRayCollisions(intersections);
};
