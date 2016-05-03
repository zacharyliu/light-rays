var Game = function (mainContainer, canvas) {
  var self = this;

  this.mainContainer = mainContainer;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  
  this.renderer = new Renderer(this.canvas, this.ctx);

  this.initialCanvasWidth = this.canvas.width = 320;
  this.initialCanvasHeight = this.canvas.height = 480;
  this.mainContainer.appendChild(this.canvas);

  this.gameState = new GameState();
  
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
  this.then = Date.now();
  this.running = true;
  this.main();
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

  this.gameState.update(dt);
  this.renderer.render(this.gameState);

  this.then = now;
  requestAnimationFrame(this.main.bind(this));
};
