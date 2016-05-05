var Mirror = function (opts) {
  this.type = 'mirror';

  opts = opts || {};
  var geometry = new THREE.BoxBufferGeometry( 2, opts.length || 50, 10 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  object.position.copy(opts.position);
  if (opts.angle) object.rotation.z = opts.angle;

  GameObject.call(this, object, opts);
};

Mirror.prototype = Object.create(GameObject.prototype);

Mirror.prototype.reflectIntersection = function (ray, intersection) {
  // TODO: check if face is front face
  var normal = intersection.face.normal.clone().applyEuler(intersection.object.rotation);
  var newRay = ray.clone();
  newRay.origin.copy(intersection.point);
  newRay.direction.reflect(normal);
  return newRay;
};

Mirror.prototype.hasIntersection = function (gameObjects) {
  var bbox = new THREE.Box3().setFromObject(this.body);
  var hasIntersection = false;
  gameObjects.forEach(function(elem, i) {
    var bboxOther = new THREE.Box3().setFromObject(elem.body);
    hasIntersection = hasIntersection || bbox.intersectsBox(bboxOther);
  });
  return hasIntersection;
};
