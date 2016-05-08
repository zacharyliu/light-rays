var FilterObstacle = function (opts) {
  this.type = 'filterObstacle';
  Obstacle.call(this, opts);
};

FilterObstacle.prototype = Object.create(Obstacle.prototype);

FilterObstacle.prototype.handleCollision = function (intersection) {
  // TODO: decide behavior based on incoming color
  return Collider.CollisionBehavior.CHANGE_COLOR;
};

FilterObstacle.prototype.colorIntersection = function (intersection) {
  return this.color;
};
