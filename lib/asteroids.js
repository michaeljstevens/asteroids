const Game = require('./game.js');
const GameView = require('./game_view.js');

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("game-canvas");
  let game = new Game();
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  let ctx = canvasEl.getContext("2d");
  new GameView(game, ctx).start();
});
