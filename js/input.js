var GameInputFactory = function (renderer) {
  var canvas = renderer.canvas;
  var camera = renderer.camera;

  var pressedKeys = {};
  var mousePos = new THREE.Vector3();

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

  document.addEventListener('keydown', function(e) {
    setKey(e, true);
  });

  document.addEventListener('keyup', function(e) {
    setKey(e, false);
  });

  ['mousemove', 'touchmove', 'touchstart'].forEach(type => canvas.addEventListener(type, function (e) {
    // Scale position to game coordinate system
    mousePos.x = e.offsetX / parseFloat(e.target.style.width) * GameState.WIDTH;
    mousePos.y = e.offsetY / parseFloat(e.target.style.height) * GameState.HEIGHT;
  }));

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
