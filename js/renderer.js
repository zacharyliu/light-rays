var Renderer = function (canvas, ctx) {
  this.canvas = canvas;
  this.ctx = ctx;
};

// Draw everything
Renderer.prototype.render = function (gameState) {
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.fillStyle = 'green';
  this.ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.sizeX, gameState.player.sizeY);

  this._renderRay(gameState);
};

Renderer.prototype._renderRay = function (gameState) {
  this.ctx.strokeStyle = 'yellow';
  this.ctx.beginPath();
  this.ctx.moveTo(gameState.lightRay.origin.x, gameState.lightRay.origin.y);
  var len = gameState.rayCollisions.length;
  for (var collision of gameState.rayCollisions) {
    this.ctx.lineTo(collision.x, collision.y);
    this.ctx.stroke();
  }
}