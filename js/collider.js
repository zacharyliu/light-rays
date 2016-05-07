var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.CollisionBehavior = Object.freeze({
  PASS: 0,
  ABSORB: 1,
  REFLECT: 2
});

Collider.prototype.collide = function (lightRay, objects) {
  var ray = lightRay.ray;
  var intersections = [];

  var doRaycast = true;
  while (doRaycast) {
    if (intersections.length > 500) {
      console.warn("Exceeded 500 intersections");
      break;
    }

    doRaycast = false;
    this.raycaster.set(ray.origin, ray.direction);
    var result = this.raycaster.intersectObjects(objects.map(function (e) {
      return e.body;
    }));
    for (var intersection of result) {
      var entity = intersection.object.userData.entity;

      intersection.ray = ray;
      intersections.push(intersection);

      entity.isColliding = true;
      entity.intersections.push(intersection);

      let collisionBehavior = entity.handleCollision(intersection);
      if (collisionBehavior === Collider.CollisionBehavior.PASS) {
        continue;
      } else if (collisionBehavior === Collider.CollisionBehavior.ABSORB) {
        break;
      } else if (collisionBehavior === Collider.CollisionBehavior.REFLECT) {
        let newRay = entity.reflectIntersection(ray, intersection);
        if (newRay) {
          ray = newRay;
          doRaycast = true;
          break;
        }
      } else {
        throw new Error("Entity is missing a valid collision behavior");
      }
    }
  }

  lightRay.updateRayCollisions(intersections);
};
