var GameState = function () {
  // The player's state
  this.player = {
    x: 0,
    y: 0,
    sizeX: 30,
    sizeY: 30
  };

  this.reset();
};

// Update game objects.
// We'll use GameInput to detect which keys are down.
// If you look at the bottom of index.html, we load GameInput
// from js/input.js right before app.js
GameState.prototype.update = function (dt) {
  // Speed in pixels per second
  var playerSpeed = 100;

  if (GameInput.isDown('DOWN')) {
    // dt is the number of seconds passed, so multiplying by
    // the speed gives you the number of pixels to move
    this.player.y += playerSpeed * dt;
  }

  if (GameInput.isDown('UP')) {
    this.player.y -= playerSpeed * dt;
  }

  if (GameInput.isDown('LEFT')) {
    this.player.x -= playerSpeed * dt;
  }

  if (GameInput.isDown('RIGHT')) {
    this.player.x += playerSpeed * dt;
  }

  // You can pass any letter to `isDown`, in addition to DOWN,
  // UP, LEFT, RIGHT, and SPACE:
  // if(GameInput.isDown('a')) { ... }
};

// Reset game to original state
GameState.prototype.reset = function () {
  this.player.x = 0;
  this.player.y = 0;
};
