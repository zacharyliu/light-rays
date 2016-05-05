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

  lightRay.updateRayCollisions(intersections);
};
