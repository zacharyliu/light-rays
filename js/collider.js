var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.prototype.collide = function (lightRay, objects) {
  var ray = lightRay.ray;
  var intersections = [];

  var doRaycast = true;
  while (doRaycast) {
    doRaycast = false;
    this.raycaster.set(ray.origin, ray.direction);
    var result = this.raycaster.intersectObjects(objects.map(function (e) {
      return e.body;
    }));
    for (var intersection of result) {
      var entity = intersection.object.userData.entity;
      // if (!entity.shouldCollide) continue;
      
      intersection.ray = ray;
      intersections.push(intersection);
      
      entity.isColliding = true;
      entity.intersections.push(intersection);
      
      var reflectIntersection = entity.reflectIntersection;
      var newRay;
      if (reflectIntersection && (newRay = reflectIntersection(ray, intersection))) {
        ray = newRay;
        doRaycast = true;
        break;
      }
    }
  }

  lightRay.updateRayCollisions(intersections);
};
