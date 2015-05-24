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

ViewPort.prototype.getVisiblePlayers = function(players) {
  var onScreen = [];

  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    if (Math.abs(player.x_ - selfCoords[0]) < 400 &&
        Math.abs(player.y_ - selfCoords[1]) < 300) {
      onScreen.push(player);
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
