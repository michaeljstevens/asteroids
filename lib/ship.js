const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

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

Ship.prototype.fireBullet = function () {
  let norm = Util.norm(this.vel);

  if (norm == 0) {
    return;
  }

  let relVel = Util.scale(
    Util.dir(this.vel),
    Bullet.SPEED
  );

  let bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  let bullet = new Bullet({
    pos: this.pos,
    vel: bulletVel,
    color: this.color,
    game: this.game
  });

  this.game.add(bullet);
};


module.exports = Ship;
