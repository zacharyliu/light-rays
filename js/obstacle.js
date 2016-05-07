var Obstacle = function (opts) {
  this.type = 'obstacle';

  opts = opts || {};
  var geometry = new THREE.BoxGeometry( 10, opts.height || 10, opts.width || 10 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

  GameObject.call(this, object, opts);
};

Obstacle.prototype = Object.create(GameObject.prototype);

Obstacle.prototype.handleCollision = () => Collider.CollisionBehavior.ABSORB;
