var LightRay = function (ray, velocity, color) {
  this.ray = ray;
  this.rayCollisions = [];
  this.velocity = velocity;
  this.color = color || 0xffff00;

  /** @var {THREE.Object3D} Wrapper object for light ray segments */
  this.body = new THREE.Object3D();

  this.particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 250000,
    velocityScale: 10.
  });
  this.particleSystem.position.z = -5.1;
  this.particleSystemOptions = {
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: 3,
    color: 0xffff00,
    colorRandomness: .2,
    turbulence: .2,
    lifetime: 2,
    size: 10,
    sizeRandomness: 1,
    wind: new THREE.Vector3(0, 5, 0)
  };
  this.particleSystemSpawnRate = 100;
  this.tick = 0;
};

LightRay.MAX_POINTS = 500;

LightRay.prototype.updateRayCollisions = function (newRayCollisions) {
  this.rayCollisions = newRayCollisions;

  // FIXME: this approach is inefficient due to constant creation/deletion of planes

  // Remove all children
  for (let i = this.body.children.length - 1; i >=0; i--) {
    this.body.remove(this.body.children[i]);
  }

  // Add lines (as planes) between points
  let prev = this.ray.origin;
  let currentColor = this.color;
  for (var e of this.rayCollisions) {
    /** @var {THREE.Vector3} Vector from previous point to current point */
    let vector = new THREE.Vector3().subVectors(e.point, prev);
    let geometry = new THREE.PlaneGeometry(vector.length(), 2);
    let obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: currentColor})); // TODO: variable color
    /** @var {Number} Angle of rotation from +x axis */
    let theta = Math.atan2(vector.y, vector.x);

    obj.position.copy(vector).multiplyScalar(1 / 2).add(prev); // Position at middle between points
    obj.rotation.x = Math.PI;
    obj.rotation.z = -theta; // Negative rotation since view is reversed

    this.body.add(obj);

    prev = e.point;
    if (e.hasOwnProperty('colorOut')) currentColor = e.colorOut;
  }
};

LightRay.prototype.update = function (dt) {
  // Move ray at constant velocity
  this.ray.origin.add(this.velocity.clone().multiplyScalar(dt));

  for (let collision of this.rayCollisions) {
    if (collision.behavior == Collider.CollisionBehavior.PASS) continue;

    // Move particle spawn point to ray collision
    this.particleSystemOptions.position.copy(collision.point);

    // Set particle color
    this.particleSystemOptions.color = collision.color;

    // Spawn particles
    let count = this.particleSystemSpawnRate * dt;
    if (collision.hasOwnProperty("colorOut")) {
      // If color changed, then spawn half of each color
      for (let x = 0; x < count / 2; x++) {
        this.particleSystem.spawnParticle(this.particleSystemOptions);
      }
      this.particleSystemOptions.color = collision.colorOut;
      for (let x = 0; x < count / 2; x++) {
        this.particleSystem.spawnParticle(this.particleSystemOptions);
      }
    } else {
      for (let x = 0; x < count; x++) {
        this.particleSystem.spawnParticle(this.particleSystemOptions);
      }
    }
  }

  this.tick += dt;
  this.particleSystem.update(this.tick);
};
