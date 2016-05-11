var Obstacle = function (opts) {
  this.type = 'obstacle';

  opts = opts || {};
  var geometry = new THREE.BoxGeometry( 10, opts.height || 10, opts.width || 10, 3, 3, 3 );
  this._modifier.modify(geometry);
  this.color = opts.color !== undefined ? opts.color : Math.random() * 0xffffff;
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: this.color } ) );

  GameObject.call(this, object, opts);
};

Obstacle.prototype = Object.create(GameObject.prototype);

Obstacle.prototype._modifier = new THREE.SubdivisionModifier(2);

Obstacle.prototype.handleCollision = function (intersection) {
  return (intersection.color == this.color) ? Collider.CollisionBehavior.PASS : Collider.CollisionBehavior.ABSORB;
};
