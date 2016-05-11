var UI = function (score, toast, pause) {
  this.score = score;
  this.toast = toast;
  this.pause = pause;

  this.points = 0;
};

UI.prototype.resetPoints = function () {
  this.points = 0;
  this._updateScore();
};

UI.prototype.addPoints = function(n) {
  this.points += Math.floor(n);
  this._updateScore();
};

UI.prototype.makeToast = function(s) {
  this.toast.innerHTML = s;
};

UI.prototype.togglePauseMenu = function(paused) {
  if (paused) {
    this.pause.style.visibility = 'visible';
  }
  else {
    this.pause.style.visibility = 'hidden'; 
  }
};

UI.prototype._updateScore = function() {
  this.score.innerHTML = 'Score: ' + this.points;
};
