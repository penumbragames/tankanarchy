/**
 * Manages the player viewport when they move around.
 */

function ViewPort(selfId) {
  this.selfCoords_ = [];
  this.selfId_ = selfId;
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
    if (Math.abs(players[i].x_ - this.selfCoords_[0]) < 400 &&
        Math.abs(players[i].y_ - this.selfCoords_[1]) < 300) {
      onScreen.push(players[i]);
    }
  }
  return onScreen;
};

ViewPort.prototype.toCanvasCoords = function(object) {
  if (object.id_ == this.selfId_) {
    object.x_ = 400;
    object.y_ = 300;
  } else {
    object.x_ -= this.selfCoords_[0] - 400;
    object.y_ -= this.selfCoords_[1] - 300;
  }
  return object;
};
