var GameObject = function (body, opts) {
  opts = opts || {};
  this.velocity = opts.velocity || new THREE.Vector3();

  /** @var {THREE.Object3D} */
  this.body = body;
  this.body.userData.entity = this;

  this.mouseOverBody = opts.mouseOverBody || body;
  if (this.mouseOverBody != this.body) {
    this.mouseOverBody.userData.entity = this;
    this.body.add(this.mouseOverBody);
  }

  // TODO: handle collision cases
  this.shouldCollide = false;

  this.body.position.copy(opts.position);
  this.body.rotation.order = "ZXY";
  this.body.rotation.y = Math.PI / 2;
  if (opts.angle) this.body.rotation.z = opts.angle;

  // Whether this object has collided since the previous update
  this.isColliding = false;
  this.intersections = [];

  this.isMouseOver = false;
};

GameObject.prototype.update = function (dt) {
  this.isColliding = false;
  this.intersections.splice(0);
  this.body.position.add(this.velocity.clone().multiplyScalar(dt));
};

GameObject.prototype.testIntersect = function (ray) {
  if (!this.body) return Math.POSITIVE_INFINITY;
  // TODO
};

GameObject.createBox = function (width, height, position) {
  var body = new THREE.Mesh( new THREE.BoxGeometry(10, height, width), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  return new GameObject(body, {
    position: position
  });
};
