var Generator = function (container, velocity, lightRay) {
  this.container = container;
  this.velocity = velocity;
  this.lightRay = lightRay;

  this._distToNext = 0;
};

Generator.prototype.update = function (dt) {
  this._distToNext -= this.velocity.length() * dt;

  if (this._distToNext < 0) {
    this._distToNext = this._SCENES[Math.floor(this._SCENES.length * Math.random())](this.container, this.velocity, this.lightRay);
  }
};

Generator._COLORS = [0xFF6B6B, 0x7CFF46, 0x4ECDC4];

Generator._randomColor = function (skipColor) {
  var color;
  do {
    color = Generator._COLORS[Math.floor(Generator._COLORS.length * Math.random())];
  } while (color === skipColor);
  return color;
};

Generator.prototype._SCENES = [
  function (container, velocity) {
    let ob1 = new Obstacle({
      width: GameState.WIDTH * 0.6,
      height: 10,
      position: new THREE.Vector3(GameState.WIDTH * 0.3, -5, 0),
      velocity: velocity,
      color: Please.make_color({
        greyscale: true,
      })
    });
    let ob2 = new Obstacle({
      width: GameState.WIDTH * 0.6,
      height: 10,
      position: new THREE.Vector3(GameState.WIDTH * 0.7, -100, 0),
      velocity: velocity,
      color: Please.make_color({
        greyscale: true,
      })
    });
    container.add(ob1);
    container.add(ob2);
    return 190;
  },
  function (container, velocity, lightRay) {
    let color = Generator._randomColor(lightRay.getFinalColor());
    let order = Math.random() < 0.5;
    let ob = new Obstacle({
      width: GameState.WIDTH * 0.5,
      height: 10,
      position: new THREE.Vector3(GameState.WIDTH * (order ? 0.25 : 0.75), -80, 0),
      velocity: velocity,
      color: color
    });
    let ob2 = new Obstacle({
      width: GameState.WIDTH * 0.5,
      height: 10,
      position: new THREE.Vector3(GameState.WIDTH * (order ? 0.75 : 0.25), -80, 0),
      velocity: velocity,
      color: Please.make_color({
        greyscale: true,
      })
    });
    let fb = new FilterObstacle({
      radius: 15,
      position: new THREE.Vector3(GameState.WIDTH * (0.2 + 0.6 * Math.random()), -10, 0),
      velocity: velocity,
      color: color
    });
    container.add(ob, ob2, fb);
    return 150;
  },
  function (container, velocity, lightRay) {
    let obstacle;
    let position = new THREE.Vector3(Math.random() * GameState.WIDTH, -10, 0);
    let color = Generator._randomColor(lightRay.getFinalColor());
    if (Math.random() < 0.5) {
      obstacle = new FilterObstacle({
        radius: 15,
        position: position,
        velocity: velocity,
        color: color
      });
    } else {
      obstacle = new Obstacle({
        width: 100,
        height: 10,
        position: position,
        velocity: velocity,
        color: color
      });
    }
    container.add(obstacle);
    return 60 + Math.random() * 50;
  }
];

Generator.prototype.reset = function () {
  this._distToNext = 0;
};
