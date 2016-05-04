var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.prototype.collide = function (gameState) {
  var rayCollisions = [];
  var ray = gameState.lightRay;
  var gameObjects = gameState.gameObjects;

  this.raycaster.set(ray.origin, ray.direction);
  var self = this;
  gameObjects.forEach(function(elem, i) {
    var intersections = self.raycaster.intersectObject(elem.body);
    if (intersections.length) {
      if (intersections.length > 1) {
        console.log("why are there so many");
      }
      var intersection = intersections[0];
      rayCollisions.push({
        x: intersection.point.x,
        y: intersection.point.y,
        type: elem.type
      });
      console.log(intersection.point);
    }
    else {
      // no collision
    }
  });  
  gameState.rayCollisions = rayCollisions;
};
