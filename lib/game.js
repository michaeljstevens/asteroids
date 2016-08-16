const Asteroid = require("./asteroid.js");
const Util = require("./utils.js");

function Game() {
  let asteroids = [];
  this.asteroids = asteroids;
  this.addAsteroids();
}

Game.DIM_X = 500;
Game.DIM_Y = 500;
Game.NUM_ASTEROIDS = 20;

Game.prototype.randomPos = function () {
  let x = Math.random(this.DIM_X);
  let y = Math.random(this.DIM_Y);
  return [x, y];
};

Game.prototype.addAsteroids = function () {

  while (this.asteroids.length <= Game.NUM_ASTEROIDS) {
    let aster = new Asteroid({pos: this.randomPos(), game: this});
    this.asteroids.push(aster);
  }
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(250, 250, Game.DIM_X, Game.DIM_Y);
  this.asteroids.forEach((el) => (el.draw(ctx)));
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function () {
  this.asteroids.forEach((el) => (el.move()));
};

Game.prototype.wrap = function (pos) {
  return [
    Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
  ];
};

module.exports = Game;
