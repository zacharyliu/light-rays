var GameInputFactory = function (renderer) {
  var canvas = renderer.canvas;
  var camera = renderer.camera;

  var pressedKeys = {};
  var mousePos = new THREE.Vector3();

  var gamePlaneRaycaster = new THREE.Raycaster();

  function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch(code) {
      case 32:
        key = 'SPACE'; break;
      case 37:
        key = 'LEFT'; break;
      case 38:
        key = 'UP'; break;
      case 39:
        key = 'RIGHT'; break;
      case 40:
        key = 'DOWN'; break;
      default:
        // Convert ASCII codes to letters
        key = String.fromCharCode(event.keyCode);
    }

    pressedKeys[key] = status;
  }

  function updateMouse(x, y) {
    // Scale position to NDC
    let coords = new THREE.Vector2();
    coords.x = x / parseFloat(canvas.style.width) * 2 - 1;
    coords.y = -(y / parseFloat(canvas.style.height) * 2 - 1);

    // Update raycaster
    gamePlaneRaycaster.setFromCamera(coords, camera);

    // Compute ray-plane intersection with ground plane (z=0)
    let N = new THREE.Vector3(0, 0, -1);
    let t = -gamePlaneRaycaster.ray.origin.dot(N) / gamePlaneRaycaster.ray.direction.dot(N);
    mousePos.copy(gamePlaneRaycaster.ray.direction).multiplyScalar(t).add(gamePlaneRaycaster.ray.origin);
  }

  document.addEventListener('keydown', function(e) {
    setKey(e, true);
  });

  document.addEventListener('keyup', function(e) {
    setKey(e, false);
  });

  ['touchstart', 'touchmove'].forEach(type => canvas.addEventListener(type, function (e) {
    updateMouse(e.touches[0].pageX, e.touches[0].pageY);
  }));

  canvas.addEventListener("mousemove", function (e) {
    updateMouse(e.offsetX, e.offsetY);
  });

  ['mousedown', 'touchstart'].forEach(type => canvas.addEventListener(type, function(e) {
    pressedKeys['MOUSE'] = true;
  }));

  ['mouseup', 'touchend'].forEach(type => canvas.addEventListener(type, function(e) {
    pressedKeys['MOUSE'] = false;
  }));

  window.addEventListener('blur', function() {
    pressedKeys = {};
  });


  function isDown(key) {
    return pressedKeys[key];
  }

  function getMousePos() {
    return mousePos;
  }

  /**
   * Update the given raycaster with the current mouse position.
   * @param raycaster {THREE.Raycaster}
   */
  function updateRaycaster(raycaster) {
    raycaster.set(camera.position, getMousePos().clone().sub(camera.position).normalize());
  }

  return {
    isDown: isDown,
    getMousePos: getMousePos,
    updateRaycaster: updateRaycaster
  };

};
