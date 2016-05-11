var LightRay = function (ray, velocity, color) {
  this.ray = ray;
  this.rayCollisions = [];
  this.velocity = velocity;
  this.color = color || 0xFF6B6B;

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
    turbulence: .1,
    lifetime: 1.5,
    size: 20,
    sizeRandomness: 1,
    wind: new THREE.Vector3(0, 5, 0)
  };
  this.particleSystemSpawnRate = 30;
  this.particleSystemMinDistance = 10;
  this.tick = 0;
};

LightRay.prototype.updateRayCollisions = function (newRayCollisions) {
  this.rayCollisions = newRayCollisions;

  // FIXME: this approach is inefficient due to constant creation/deletion of planes

  // Add lines (as planes) between points
  let prev = this.ray.origin;
  let currentColor = this.color;
  let count = Math.min(this.rayCollisions.length, Collider.MAX_COLLISIONS);
  for (let i = 0; i < count; i++) {
    let e = this.rayCollisions[i];
    /** @var {THREE.Vector3} Vector from previous point to current point */
    let vector = new THREE.Vector3().subVectors(e.point, prev);
    let geometry = new THREE.PlaneGeometry(vector.length(), 2);
    let obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: currentColor}));
    /** @var {Number} Angle of rotation from +x axis */
    let theta = Math.atan2(vector.y, vector.x);

    obj.position.copy(vector).multiplyScalar(1 / 2).add(prev); // Position at middle between points
    obj.rotation.x = Math.PI;
    obj.rotation.z = -theta; // Negative rotation since view is reversed

    this.body.children[i] = obj;

    prev = e.point;
    if (e.hasOwnProperty('colorOut')) currentColor = e.colorOut;
  }

  // Remove remaining elements
  this.body.children.splice(count);
};

LightRay.prototype.update = function (dt) {
  // Move ray at constant velocity
  this.ray.origin.add(this.velocity.clone().multiplyScalar(dt));

  // FIXME: hack to ensure that the first collision always spawns particles
  this.particleSystemOptions.position = new THREE.Vector3(-this.particleSystemMinDistance + 1, 0, 0);

  for (let collision of this.rayCollisions) {
    if (collision.behavior == Collider.CollisionBehavior.PASS) continue;

    let shouldSpawn = this.particleSystemOptions.position.distanceTo(collision.point) > this.particleSystemMinDistance;

    // Move particle spawn point to ray collision
    this.particleSystemOptions.position.copy(collision.point);

    if (!shouldSpawn) continue;

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
