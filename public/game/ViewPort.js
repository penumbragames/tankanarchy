/**
 * Manages the player viewport when they move around.
 */

function ViewPort() {}

ViewPort.getVisiblePlayers = function(game) {
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
}

ViewPort.toCanvasCoords = function(game, object) {
  if (object.id_ == game.getID()) {
    return [400, 300];
  } else {
    var self = game.findSelf();
    var translateX = self.x_ - 400;
    var translateY = self.y_ - 300;
    return [object.x_ - translateX,
            object.y_ - translateY];
  }
}
