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
  this.ctx.moveTo(gameState.ray.position.x, gameState.ray.position.y);
  this.ctx.lineTo(gameState.ray.position.x + gameState.ray.direction.x, gameState.ray.position.y + gameState.ray.direction.y);
  this.ctx.stroke();
};
