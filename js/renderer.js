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

  this.ctx.strokeStyle = 'yellow';
  this.ctx.beginPath();
  this.ctx.moveTo(gameState.lightRay.origin.x, gameState.lightRay.origin.y);
  this.ctx.lineTo(gameState.lightRay.origin.x + gameState.lightRay.direction.x, gameState.lightRay.origin.y + gameState.lightRay.direction.y);
  this.ctx.stroke();
};
