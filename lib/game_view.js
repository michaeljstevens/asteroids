const Game = require('./game.js');

function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
}

GameView.prototype.start = function () {
  window.setInterval(this.game.draw(this.ctx), 20);
  window.setInterval(this.game.moveObjects(), 20);
};
module.exports = GameView;
