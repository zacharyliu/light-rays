var GameObject = function (body, opts) {
  opts = opts || {};
  this.velocity = opts.velocity || new THREE.Vector3();
  this.body = body;
  this.body.userData.entity = this;
};

GameObject.prototype.update = function (dt) {
  this.body.position.add(this.velocity.clone().multiplyScalar(dt));
};

GameObject.prototype.testIntersect = function (ray) {
  if (!this.body) return Math.POSITIVE_INFINITY;
  // TODO
};
