/**
 * Manages the player viewport when they move around.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 */

function ViewPort() {
  this.selfCoords_ = [];
  this.selfId_ = null;
};

ViewPort.prototype.setID = function(id) {
  this.selfId_ = id;
};

ViewPort.prototype.update = function(x, y) {
  this.selfCoords_ = [x, y];
};

ViewPort.prototype.getVisibleObjects = function(objects) {
  var onScreen = [];

  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    if (Math.abs(object.x_ - this.selfCoords_[0]) < 400 &&
        Math.abs(object.y_ - this.selfCoords_[1]) < 300) {
      onScreen.push(object);
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
