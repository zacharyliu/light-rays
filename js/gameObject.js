var GameObject = function (body, opts) {
  opts = opts || {};
  this.velocity = opts.velocity || new THREE.Vector3();
  this.body = body;
  this.body.userData.entity = this;

  this.body.position.copy(opts.position);
  if (opts.angle) this.body.rotation.z = opts.angle;

  // Whether this object has collided since the previous update
  this.isColliding = false;
};

GameObject.prototype.update = function (dt) {
  this.isColliding = false;
  this.body.position.add(this.velocity.clone().multiplyScalar(dt));
};

GameObject.prototype.testIntersect = function (ray) {
  if (!this.body) return Math.POSITIVE_INFINITY;
  // TODO
};

GameObject.createBox = function (width, height, position) {
  var body = new THREE.Mesh( new THREE.BoxGeometry(width, height, 10), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  return new GameObject(body, {
    position: position
  });
};
