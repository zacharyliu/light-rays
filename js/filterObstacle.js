var FilterObstacle = function (opts) {
  this.type = 'filterObstacle';

  opts = opts || {};
  var geometry = new THREE.SphereGeometry(opts.radius || 15, 16, 12);
  this.color = opts.color || Math.random() * 0xffffff;
  var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: this.color}));

  GameObject.call(this, object, opts);
};

FilterObstacle.prototype = Object.create(GameObject.prototype);

FilterObstacle.prototype.handleCollision = () => Collider.CollisionBehavior.CHANGE_COLOR;

FilterObstacle.prototype.colorIntersection = function (intersection) {
  return this.color;
};
