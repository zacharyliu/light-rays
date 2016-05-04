var GameInput = (function() {

  var pressedKeys = {};
  var mousePos = {};

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

  document.addEventListener('mousedown', function(e) {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    pressedKeys['MOUSE'] = true;
  });

  document.addEventListener('mouseup', function(e) {
    pressedKeys['MOUSE'] = false;
  });

  window.addEventListener('blur', function() {
    pressedKeys = {};
  });


  function isDown(key) {
    return pressedKeys[key];
  }

  function getMousePos() {
    return mousePos;
  }

  return {
    isDown: isDown,
    getMousePos: getMousePos
  };

})();
