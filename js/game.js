var Game = function (mainContainer, canvas) {
  var self = this;

  this.mainContainer = mainContainer;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");

  this.initialCanvasWidth = this.canvas.width = 320;
  this.initialCanvasHeight = this.canvas.height = 480;
  this.mainContainer.appendChild(this.canvas);

  // The player's state
  this.player = {
    x: 0,
    y: 0,
    sizeX: 30,
    sizeY: 30
  };

  // Don't run the game when the tab isn't visible
  window.addEventListener('focus', function () {
    self.unpause();
  });

  window.addEventListener('blur', function () {
    self.pause();
  });

  window.addEventListener('resize', this.resize);

  //Initially resize the game canvas.
  this._resize();
  // Let's play this game!
  this._reset();
  this.then = Date.now();
  this.running = true;
  this.main();
};

// Update game objects.
// We'll use GameInput to detect which keys are down.
// If you look at the bottom of index.html, we load GameInput
// from js/input.js right before app.js
Game.prototype._update = function (dt) {
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

// Draw everything
Game.prototype._render = function () {
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.fillStyle = 'green';
  this.ctx.fillRect(this.player.x, this.player.y, this.player.sizeX, this.player.sizeY);
};

// based on: https://hacks.mozilla.org/2013/05/optimizing-your-javascript-game-for-firefox-os/
Game.prototype._resize = function () {
  var browser = [
    window.innerWidth,
    window.innerHeight
  ];
  // Minimum scale
  var scale = Math.min(
    browser[0] / this.initialCanvasWidth,
    browser[1] / this.initialCanvasHeight);
  // Scaled content size
  var size = [
    this.initialCanvasWidth * scale,
    this.initialCanvasHeight * scale
  ];
  // Offset from top/left
  var offset = [
    (browser[0] - size[0]) / 2,
    (browser[1] - size[1]) / 2
  ];

  // Apply CSS transform
  var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scale + ")";
  this.mainContainer.style.transform = rule;
  this.mainContainer.style.webkitTransform = rule;
};

// Reset game to original state
Game.prototype._reset = function () {
  this.player.x = 0;
  this.player.y = 0;
};

// Pause and unpause
Game.prototype.pause = function () {
  this.running = false;
};

Game.prototype.unpause = function () {
  this.running = true;
  this.then = Date.now();
  this.main();
};

// The main game loop
Game.prototype.main = function () {
  if (!this.running) {
    return;
  }

  var now = Date.now();
  var dt = (now - this.then) / 1000.0;

  this._update(dt);
  this._render();

  this.then = now;
  requestAnimationFrame(this.main.bind(this));
};
