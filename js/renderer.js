var Renderer = function (mainContainer, canvas, ctx) {
  this.canvas = canvas;
  this.ctx = ctx;
};

// Draw everything
Renderer.prototype.render = function (gameState) {
  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  this._renderObjects(gameState);

  this._renderRay(gameState);
};

Renderer.prototype._renderObjects = function (gameState) {
  var gameObjects = gameState.gameObjects;
  this.ctx.fillStyle = 'green';
  var self = this;  
  gameObjects.forEach(function(elem, i) {
    self.ctx.fillRect(elem.body.position.x - 10, elem.body.position.y - 10, 20, 20);
  });
}

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