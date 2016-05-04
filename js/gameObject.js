var GameObject = function (position, width, height) {
  this.velocity = 0;
  this.position = position;
  this.width = width;
  this.height = height;

  this.center = this.position.clone();
  this.center.x += width / 2;
  this.center.y += height / 2;
};

GameObject.prototype.update = function (dt) {
  this.position.y += this.velocity * dt;
};

GameObject.prototype.testIntersect = function (ray) {
  if (!this.body) return Math.POSITIVE_INFINITY;
  // TODO
};
