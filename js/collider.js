var Collider = function () {};

Collider.prototype.collide = function (gameState) {
  var rayCollisions = [];
  var ray = gameState.ray;

  // TODO: Call GameObject.testCollision?
  
  gameState.rayCollisions = rayCollisions;
};
