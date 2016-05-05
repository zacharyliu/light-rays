var Mirror = function (opts) {
  this.type = 'mirror';
  this.state = opts.state || Mirror.State.NORMAL;

  opts = opts || {};
  var geometry = new THREE.BoxBufferGeometry( 10, opts.length || 50, 2 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
  opts.mouseOverBody = new THREE.Mesh(new THREE.SphereGeometry(opts.length / 2 + 10), new THREE.MeshBasicMaterial({visible: false}));

  GameObject.call(this, object, opts);
};

Mirror.State = {
  NORMAL: 0,
  GHOST: 1,
  HOVERING: 2,
  SELECTED: 3
};

Object.freeze(Mirror.State);

Mirror.prototype = Object.create(GameObject.prototype);

Mirror.prototype.update = function (dt) {
  GameObject.prototype.update.call(this, dt);
  
  if (this.state == Mirror.State.SELECTED) this.body.lookAt(GameInput.getMousePos());

  let newState;
  switch (this.state) {
    case Mirror.State.SELECTED:
      if (!GameInput.isDown('MOUSE')) {
        newState = this.isMouseOver ? Mirror.State.HOVERING : Mirror.State.NORMAL;
      }
      break;
    case Mirror.State.HOVERING:
      if (GameInput.isDown('MOUSE')) {
        newState = Mirror.State.SELECTED;
      }
      break;
  }
  if (newState != null) this.state = newState;
};

Mirror.prototype.shouldReflectIntersection = function () {
  return this.state != Mirror.State.GHOST;
};

Mirror.prototype.reflectIntersection = function (ray, intersection) {
  // TODO: check if face is front face
  var normal = intersection.face.normal.clone().applyEuler(intersection.object.rotation);
  var newRay = ray.clone();
  newRay.origin.copy(intersection.point);
  newRay.direction.reflect(normal);
  return newRay;
};

Mirror.prototype.hasIntersection = function (gameObjects) {
  // TODO: proper intersection support
  return false;

  var bbox = new THREE.Box3().setFromObject(this.body);
  var hasIntersection = false;
  gameObjects.forEach(function(elem, i) {
    var bboxOther = new THREE.Box3().setFromObject(elem.body);
    hasIntersection = hasIntersection || bbox.intersectsBox(bboxOther);
  });
  return hasIntersection;
};
