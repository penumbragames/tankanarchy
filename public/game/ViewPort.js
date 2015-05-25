/**
 * Manages the player viewport when they move around.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 */

function ViewPort() {
  this.selfCoords = [];
  this.selfId = null;
};

ViewPort.prototype.setID = function(id) {
  this.selfId = id;
};

ViewPort.prototype.update = function(x, y) {
  this.selfCoords = [x, y];
};

ViewPort.prototype.getVisibleObjects = function(objects) {
  var onScreen = [];
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    if (Math.abs(object.x - this.selfCoords[0]) < 450 &&
        Math.abs(object.y - this.selfCoords[1]) < 350) {
      onScreen.push(object);
    }
  }
  return onScreen;
};

ViewPort.prototype.toCanvasCoords = function(object) {
  if (object.id == this.selfId) {
    return [Game.WIDTH / 2, Game.HEIGHT / 2];
  } else {
    var translateX = this.selfCoords[0] - Game.WIDTH / 2;
    var translateY = this.selfCoords[1] - Game.HEIGHT / 2;
    return [object.x - translateX,
            object.y - translateY];
  }
};
