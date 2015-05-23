/**
 * Manages the player viewport when they move around.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 */

function ViewPort() {
  this.selfCoords_ = [];
  this.selfId_ = null;
}

ViewPort.prototype.setID = function(id) {
  this.selfId_ = id;
};

ViewPort.prototype.update = function(x, y) {
  this.selfCoords_ = [x, y];
}

ViewPort.prototype.getVisiblePlayers = function(game) {
  var players = game.getPlayers();
  var onScreen = [];

  for (var i = 0; i < players.length; i++) {
    var curPlayer = players[i];
    if (Math.abs(curPlayer.getX() - player.getX()) < 400 &&
        Math.abs(curPlayer.getY() - player.getY()) < 300) {
      onScreen.push(curPlayer);
    }
  }
  return onScreen;
};

ViewPort.prototype.toCanvasCoords = function(object) {
  if (object.id_ == this.selfId_) {
    return [400, 300];
  } else {
    var translateX = this.selfCoords_[0] - 400;
    var translateY = this.selfCoords_[1] - 300;
    return [object.x_ - translateX,
            object.y_ - translateY];
  }
};
