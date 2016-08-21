const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');

const DEFAULTS = {
	COLOR: "purple",
	RADIUS: 20
};

const Ship = function (options) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || [0, 0];

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};


module.exports = Ship;
