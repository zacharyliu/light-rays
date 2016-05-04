var Mirror = function (position) {
  this.type = 'mirror';

  var geometry = new THREE.BoxBufferGeometry( 50, 2, 10 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  object.position.copy(position);
  // object.rotation.x = Math.random() * 2 * Math.PI;
  // object.rotation.y = Math.random() * 2 * Math.PI;
  object.rotation.z = Math.random() * 2 * Math.PI;
  this.body = object;
  // this.body.entity = this;
};

Mirror.prototype = Object.create(GameObject.prototype);

Mirror.prototype.onIntersectRay = function (intersection) {
  // check if face is front face
  
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
