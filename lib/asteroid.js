const Util = require("./utils.js");
const MovingObject = require("./moving_object.js");
const Game = require("./game.js");

const DEFAULTS = {
	COLOR: "red",
	RADIUS: 15,
	SPEED: 4
};

const Asteroid = function (options = {}) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
  MovingObject.call(this, options);
};

Util.inherits(Asteroid, MovingObject);
module.exports = Asteroid;
