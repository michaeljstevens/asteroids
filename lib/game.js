const Asteroid = require("./asteroid.js");
const Util = require("./utils.js");

function Game() {
  let asteroids = [];
  this.asteroids = asteroids;
  this.addAsteroids();
}

Game.BG_COLOR = "lightblue";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_ASTEROIDS = 20;

Game.prototype.randomPos = function () {
  let x = Math.random(this.DIM_X);
  let y = Math.random(this.DIM_Y);
  return [x, y];
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
    this.add(new Asteroid({ game: this }));
  }
};

Game.prototype.add = function (object) {
  if (object instanceof Asteroid) {
    this.asteroids.push(object);
  // } else if (object instanceof Bullet) {
  //   this.bullets.push(object);
  // } else if (object instanceof Ship) {
  //   this.ships.push(object);
  } else {
    throw "wtf?";
  }
};

Game.prototype.remove = function (object) {
  this.asteroids.splice(this.asteroids.indexOf(object), 1);
};


Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach((object) => {
    object.move(delta);
  });
};

Game.prototype.allObjects = function () {
  return [].concat(this.asteroids);
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  // this.checkCollisions();
};

Game.prototype.wrap = function (pos) {
  return [
    Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
  ];
};

module.exports = Game;
