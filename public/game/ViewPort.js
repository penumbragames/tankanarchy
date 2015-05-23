/**
 * Manages the player viewport when they move around.
 */

function ViewPort() {}

ViewPort.locate = function(game, player) {
  var players = game.players_;
  var id = player.getID();
  var onScreen = [player];

  for (var i = 0; i < players.length; i++) {
    var curPlayer = players[i]
    if (curPlayer.id_ != id) {
      if (Math.abs(curPlayer.getX() - player.getX()) < 400 && 
          Math.abs(curPlayer.getY() - player.getY()) < 300)
        onScreen.push(curPlayer);
    }
  }
  return onScreen;
}
  
