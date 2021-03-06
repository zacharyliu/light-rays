var Mirror = function (opts) {
  this.type = 'mirror';
  this.state = opts.state || Mirror.State.NORMAL;

  opts = opts || {};
  var geometry = new THREE.BoxBufferGeometry( 10, opts.length || 50, 2 );
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: opts.color || (Math.random() * 0xffffff) } ) );
  opts.mouseOverBody = new THREE.Mesh(new THREE.SphereGeometry(opts.length / 2 + 10), new THREE.MeshBasicMaterial({visible: false}));

  this.originalHex = object.material.emissive.getHex();

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

  if (this.state == Mirror.State.SELECTED) {
    var mirrorLook = GameInput.getMousePos().clone().add(this.body.position).sub(this.initialPosition);
    if (this.body.position.clone().sub(mirrorLook).length() > 0.1) {
      this.body.lookAt(mirrorLook);
    }
    var mouseDir = GameInput.getMousePos().clone().sub(this.initialPosition).normalize();
    var angle = Math.atan2(mouseDir.y, mouseDir.x);
    this.pointer.rotation.z = angle - Math.PI/2;
  }

  let newState;
  switch (this.state) {
    case Mirror.State.NORMAL:
      if (this.isMouseOver && !GameInput.isDown('MOUSE')) {
        newState = Mirror.State.HOVERING;
      }
      break;
    case Mirror.State.SELECTED:
      if (!GameInput.isDown('MOUSE')) {
        newState = this.isMouseOver ? Mirror.State.HOVERING : Mirror.State.NORMAL;
      }
      break;
    case Mirror.State.HOVERING:
      if (!this.isMouseOver) {
        newState = Mirror.State.NORMAL;
      } else if (GameInput.isDown('MOUSE')) {
        newState = Mirror.State.SELECTED;
      }
      break;
  }
  if (newState != null) this.setState(newState);
};

Mirror.prototype.handleCollision = function (intersection) {
  if (this.state == Mirror.State.GHOST) return Collider.CollisionBehavior.PASS;

  let normal = intersection.face.normal;
  if (normal.x == 0 && normal.y == 0 && (normal.z == 1 || normal.z == -1)) return Collider.CollisionBehavior.REFLECT;

  return Collider.CollisionBehavior.PASS;
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

Mirror.prototype.setState = function (newState) {
  // Update material
  if (newState == Mirror.State.SELECTED || newState == Mirror.State.HOVERING) {
    this.body.material.emissive.setHex( 0xff0000 );
  } else {
    this.body.material.emissive.setHex( this.originalHex );
  }

  // Save initial mouse position
  if (newState == Mirror.State.SELECTED) {
    this.initialPosition = this.body.position.clone();
    this.initialPoint = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshLambertMaterial({color: 0xffffff}));
    this.initialPoint.position.copy(GameInput.getMousePos());
    this.add(this.initialPoint);

    this.pointer = new THREE.Mesh(new THREE.CylinderGeometry(0, 5, 7, 4, 1), new THREE.MeshLambertMaterial({color: 0xffffff}));
    this.pointer.position.copy(this.initialPoint.position);
    this.pointer.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 10, 0 ) );
    this.add(this.pointer);
  } else {
    if (this.initialPoint) {
      this.remove(this.initialPoint);
    }
    if (this.pointer) {
      this.remove(this.pointer);
    }
  }

  this.state = newState;
};
