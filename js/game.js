var Game = function (mainContainer) {
  var self = this;

  this.mainContainer = mainContainer;
  this.canvas = document.createElement("canvas");
  
  this.initialCanvasWidth = this.canvas.width = GameState.WIDTH;
  this.initialCanvasHeight = this.canvas.height = GameState.HEIGHT;
  this.mainContainer.appendChild(this.canvas);

  this.gameState = new GameState(this);

  // TODO this is really init
  this.lifecycle = this._STATE.STARTED;

  this.ui = new UI(
    this.mainContainer.querySelector('score'),
    this.mainContainer.querySelector('toast'),
    this.mainContainer.querySelector('pause'));

  this.renderer = new Renderer(this.canvas);
  this.renderer.initScene(this.gameState.scene, this.gameState.effectsScene);

  window.GameInput = GameInputFactory(this.renderer);

  // Don't run the game when the tab isn't visible
  window.addEventListener('focus', function () {
    self.unpause();
  });

  window.addEventListener('blur', function () {
    self.pause();
  });

  window.addEventListener('resize', this._resize.bind(this));

  //Initially resize the game canvas.
  this._resize();

  // Let's play this game!
  this.then = Date.now();
  this.running = true;
  // FIXME: collider only works properly if a render is performed before the initial update
  this.renderer.render(this.gameState.scene);
  this.main();
};

Game.prototype._STATE = {
  INIT: 0,
  STARTED: 1,
  PAUSEMENU: 2,
  OVER: 3,
  // CUTSCENE1: 4,
  // CINEMATIC1: 4
}

Game.prototype.over = function() {
  this.ui.makeToast('Game Over');
  this.lifecycle = this._STATE.OVER;
}

Game.prototype.togglePauseMenu = function() {
  if (this.lifecycle === this._STATE.PAUSEMENU) {
    this.lifecycle = this._STATE.STARTED;
    this.ui.togglePauseMenu(false);
  }
  else if (this.lifecycle === this._STATE.STARTED) {
    this.lifecycle = this._STATE.PAUSEMENU;
    this.ui.togglePauseMenu(true);
  }
}

Game.prototype._handleInput = function() {
  var spaceIsDownNow = GameInput.isDown('SPACE');
  if (!spaceIsDownNow && this.spaceIsDown) {
    this.togglePauseMenu();
  }
  this.spaceIsDown = spaceIsDownNow;
  if (this.lifecycle === this._STATE.PAUSEMENU) return;
  var mouseIsDownNow = GameInput.isDown('MOUSE');
  if (mouseIsDownNow) {
    if (this.mouseIsDown) {
      // hold
    }
    else {
      // down
      if (this.lifecycle === this._STATE.STARTED) {
        var mousePos = GameInput.getMousePos();
        if (!this.mouseOverObject) this.gameState._placeMirror(mousePos.x, mousePos.y);
      }
      else if (this.lifecycle === this._STATE.OVER) {
        this.ui.makeToast('');
        this.gameState.reset();
        this.lifecycle = this._STATE.STARTED;
      }
    }
  }
  else {
    if (this.mouseIsDown) {
      // up
    }
    else {
      // no input
    }
  }
  this.mouseIsDown = mouseIsDownNow;
}

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
  var rule = "translate(" + offset[0] + "px, " + offset[1] + "px)";
  this.mainContainer.style.transform = rule;
  this.mainContainer.style.webkitTransform = rule;
  this.mainContainer.style.width = size[0] + "px";

  this.renderer.resize(size[0], size[1]);
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

  this._handleInput();

  var now = Date.now();
  var dt = (now - this.then) / 1000.0;

  if (this.lifecycle === this._STATE.STARTED) {
    this.gameState.update(dt);
    this.renderer.render(this.gameState.scene);
    this.ui.addPoints(dt * 491);
  }

  this.then = now;
  requestAnimationFrame(this.main.bind(this));
};
