var UI = function (mainContainer) {
  this.score = document.createElement('div');
  this.score.style.position = 'absolute';
  this.score.style.zIndex = 1;
  this.score.innerHTML = 'Score: ';
  this.score.style.top = 10 + 'px';
  this.score.style.left = 10 + 'px';
  this.score.style.color = 'white';
  mainContainer.appendChild(this.score);

  this.toast = document.createElement('div');
  this.toast.style.position = 'absolute';
  this.toast.style.zIndex = 1;
  this.toast.style.top = '33%';
  this.toast.style.left = '10px';
  this.toast.style.width = '100%';
  this.toast.style.textAlign = 'center';
  this.toast.style.color = 'white';
  this.toast.style.fontSize = '1.5em';
  mainContainer.appendChild(this.toast);

  this.points = 0;
};

UI.prototype.addPoints = function(n) {
  this.points += Math.floor(n);
  this._updateScore();
};

UI.prototype.makeToast = function(s) {
  this.toast.innerHTML = s;
};

UI.prototype._updateScore = function() {
  this.score.innerHTML = 'Score: ' + this.points;
};
