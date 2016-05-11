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

  //Initially resize the game canvas.
  this.renderer.resize();

  // Let's play this game!
  this.then = Date.now();
  this.running = true;
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

  this.gameState.update(dt);
  this.renderer.render(this.gameState.scene);

  if (this.lifecycle !== this._STATE.PAUSEMENU) {
    this.ui.addPoints(dt * 491);
  }

  this.then = now;
  requestAnimationFrame(this.main.bind(this));
};
