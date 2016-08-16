const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
const Game = require("./game.js");

function Asteroid(options) {
  const color = "blue";
  const radius = 20;
  MovingObject.call(this, {pos:options.pos, game:options.game, vel: Util.randomVec(4), radius: radius, color: color});
}

Util.inherits(Asteroid, MovingObject);
module.exports = Asteroid;
