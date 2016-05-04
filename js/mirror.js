var Mirror = function (position) {
  this.type = 'mirror';

  var geometry = new THREE.BoxBufferGeometry( 50, 2, 10 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  object.position.copy(position);
  // object.rotation.x = Math.random() * 2 * Math.PI;
  // object.rotation.y = Math.random() * 2 * Math.PI;
  object.rotation.z = Math.random() * 2 * Math.PI;
  this.body = object;
  this.body.userData.entity = this;
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
