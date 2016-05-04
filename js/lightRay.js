var LightRay = function (ray) {
  this.ray = ray;
  this.rayCollisions = [];

  // Dynamically editable line
  // http://stackoverflow.com/a/31411794/133211
  this.bodyGeometry = new THREE.BufferGeometry();
  this.positions = new Float32Array(LightRay.MAX_POINTS * 3);
  this.bodyGeometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
  this.bodyGeometry.setDrawRange(0, 1);
  this.positions[0] = this.ray.origin.x;
  this.positions[1] = this.ray.origin.y;
  this.positions[2] = this.ray.origin.z;
  this.body = new THREE.Line(this.bodyGeometry, new THREE.LineBasicMaterial({
    color: 0xffff00
  }));
};

LightRay.MAX_POINTS = 500;

LightRay.prototype.updateRayCollisions = function (newRayCollisions) {
  this.rayCollisions = newRayCollisions;

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
