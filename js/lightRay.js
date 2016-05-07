var LightRay = function (ray, velocity) {
  this.ray = ray;
  this.rayCollisions = [];
  this.velocity = velocity;

  // Dynamically editable line
  // http://stackoverflow.com/a/31411794/133211
  this.bodyGeometry = new THREE.BufferGeometry();
  this.positions = new Float32Array(LightRay.MAX_POINTS * 3);
  this.bodyGeometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
  this.bodyGeometry.setDrawRange(0, 0);
  this.body = new THREE.Line(this.bodyGeometry, new THREE.LineBasicMaterial({
    color: 0xffff00,
    linewidth: 3 // TODO: linewidth doesn't work on Windows
  }));

  this.particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 250000
  });
  this.particleSystem.position.z = -5.1;
  this.particleSystemOptions = {
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: 3,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: 0,
    lifetime: 2,
    size: 10,
    sizeRandomness: 1
  };
  this.particleSystemSpawnRate = 100;
  this.tick = 0;
};

LightRay.MAX_POINTS = 500;

LightRay.prototype.updateRayCollisions = function (newRayCollisions) {
  this.rayCollisions = newRayCollisions;

  // Need to update initial point
  this.positions[0] = this.ray.origin.x;
  this.positions[1] = this.ray.origin.y;
  this.positions[2] = this.ray.origin.z;

  var index = 3;
  for (var e of this.rayCollisions) {
    this.positions[index++] = e.point.x;
    this.positions[index++] = e.point.y;
    this.positions[index++] = e.point.z;

    if (index >= LightRay.MAX_POINTS * 3) break;
  }
  this.bodyGeometry.attributes.position.needsUpdate = true;
  this.bodyGeometry.setDrawRange(0, this.rayCollisions.length + 1);
};

LightRay.prototype.update = function (dt) {
  // Move ray at constant velocity
  this.ray.origin.add(this.velocity.clone().multiplyScalar(dt));

  if (this.rayCollisions.length > 0) {
    // Move particle spawn point to last ray collision
    this.particleSystemOptions.position.copy(this.rayCollisions[this.rayCollisions.length - 1].point);

    // Spawn particles
    for (let x = 0; x < this.particleSystemSpawnRate * dt; x++) {
      this.particleSystem.spawnParticle(this.particleSystemOptions);
    }
  }

  this.tick += dt;
  this.particleSystem.update(this.tick);
};
