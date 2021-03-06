var GameObject = function (body, opts) {
  THREE.Object3D.call(this);

  opts = opts || {};
  this.velocity = opts.velocity || new THREE.Vector3();

  /** @var {THREE.Object3D} */
  this.body = body;
  this.body.userData.entity = this;
  this.children.push(this.body);

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
  this.body.rotation.z = opts.hasOwnProperty('angle') ? opts.angle : 0;

  // Whether this object has collided since the previous update
  this.isColliding = false;
  this.intersections = [];

  this.isMouseOver = false;
};

GameObject.prototype = Object.create(THREE.Object3D.prototype);

GameObject.prototype.update = function (dt) {
  this.isColliding = false;
  this.intersections.splice(0);
  this.body.position.add(this.velocity.clone().multiplyScalar(dt));
};

GameObject.prototype.handleCollision = function (intersection) {
  return Collider.CollisionBehavior.PASS;
};

GameObject.createBox = function (width, height, position) {
  var body = new THREE.Mesh( new THREE.BoxGeometry(10, height, width), new THREE.MeshBasicMaterial( { visible: false } ) );
  return new GameObject(body, {
    position: position
  });
};
