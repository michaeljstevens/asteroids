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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Game = __webpack_require__(1);

	function Asteroid(options) {
	  const color = "blue";
	  const radius = 20;
	  MovingObject.call(this, {pos:options.pos, game:options.game, vel: Util.randomVec(4), radius: radius, color: color});
	}

	Util.inherits(Asteroid, MovingObject);
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
	    false
	  );

	  ctx.fill();
	};

	const NORMAL_FRAME_TIME_DELTA = 1000/60;

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
	  window.setInterval(this.game.draw(this.ctx), 20);
	  window.setInterval(this.game.moveObjects(), 20);
	};
	module.exports = GameView;


/***/ }
/******/ ]);