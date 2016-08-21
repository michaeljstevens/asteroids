/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(5);

	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementById("game-canvas");
	  let game = new Game();
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	  let ctx = canvasEl.getContext("2d");
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Util = __webpack_require__(3);
	const Ship = __webpack_require__(6);

	function Game() {
	  let asteroids = [];
	  this.asteroids = asteroids;
	  this.ship = new Ship({pos: this.randomPosition(), game: this});
	  this.addAsteroids();
	}

	Game.BG_COLOR = "lightblue";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_ASTEROIDS = 10;

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
	  }
	  else if (object instanceof Ship) {
	    this.ship.push(object);
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
	  return [].concat(this.asteroids, this.ship);
	};

	Game.prototype.step = function (delta) {
	  this.moveObjects(delta);
	  this.checkCollisions();
	};

	Game.prototype.wrap = function (pos) {
	  return [
	    Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
	  ];
	};

	Game.prototype.checkCollisions = function () {
	  const allObjects = this.allObjects();
	  for (let i = 0; i < allObjects.length; i++) {
	    for (let j = 0; j < allObjects.length; j++) {
	      if (i !== j) {
	        const obj1 = allObjects[i];
	        const obj2 = allObjects[j];

	        if (obj1.isCollidedWith(obj2)) {
	          const collision = obj1.collideWith(obj2);
	          if (collision) return;
	        }
	      }
	    }
	  }
	};

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Game = __webpack_require__(1);
	const Ship = __webpack_require__(6);

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

	Asteroid.prototype.collideWith = function (otherObject) {
	  if (otherObject instanceof Ship) {
	    otherObject.relocate();
			return true;
	  }
	  // else if (otherObject instanceof Bullet) {
		// 	this.remove();
		// 	otherObject.remove();
		// 	return true;
		// }

	};


	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },

	  wrap (coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Util = __webpack_require__(3);

	function MovingObject(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	}

	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    true
	  );

	  ctx.fill();
	};

	const NORMAL_FRAME_TIME_DELTA = 1000/60;

	MovingObject.prototype.isWrappable = true;

	MovingObject.prototype.move = function (timeDelta) {
	  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;

	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
	    } else {
	      this.remove();
	    }
	  }
	};

	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  const centerDist = Util.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};

	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);

	function GameView(game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	}

	GameView.prototype.start = function () {
	  // this.bindKeyHandlers();
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};

	GameView.prototype.animate = function(time){
	  const timeDelta = time - this.lastTime;

	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;

	  requestAnimationFrame(this.animate.bind(this));
	};

	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);

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


/***/ }
/******/ ]);