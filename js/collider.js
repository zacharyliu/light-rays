var Collider = function () {
  this.raycaster = new THREE.Raycaster();
};

Collider.MAX_COLLISIONS = 50;

Collider.CollisionBehavior = Object.freeze({
  PASS: 0,
  ABSORB: 1,
  REFLECT: 2,
  CHANGE_COLOR: 3
});

Collider.prototype.collide = function (lightRay, objects) {
  var ray = lightRay.ray;
  var color = lightRay.color;
  var intersections = [];

  var doRaycast = true;
  while (doRaycast) {
    if (intersections.length > Collider.MAX_COLLISIONS) {
      console.warn("Exceeded " + Collider.MAX_COLLISIONS + " intersections");
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
      intersection.color = color;
      intersections.push(intersection);

      entity.isColliding = true;
      entity.isAbsorbing = false;
      entity.intersections.push(intersection);

      let collisionBehavior = entity.handleCollision(intersection);
      intersection.behavior = collisionBehavior;
      if (collisionBehavior === Collider.CollisionBehavior.PASS) {
        continue;
      } else if (collisionBehavior === Collider.CollisionBehavior.ABSORB) {
        entity.isAbsorbing = true;
        break;
      } else if (collisionBehavior === Collider.CollisionBehavior.REFLECT) {
        let newRay = entity.reflectIntersection(ray, intersection);
        if (newRay) {
          ray = newRay;
          doRaycast = true;
          break;
        }
      } else if (collisionBehavior === Collider.CollisionBehavior.CHANGE_COLOR) {
        let newColor = entity.colorIntersection(intersection);
        if (newColor) {
          // TODO: make color storing logic more consistent
          intersection.colorOut = color = newColor;
          continue;
        } else {
          throw new Error("Missing new color for CHANGE_COLOR behavior");
        }
      } else {
        throw new Error("Entity is missing a valid collision behavior");
      }
    }
  }

  lightRay.updateRayCollisions(intersections);
};
