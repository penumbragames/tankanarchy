/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing() {}

Drawing.drawSelf = function(context, object) {
  context.save();
  context.translate(object.x_, object.y_);
  context.rotate(object.orientation_);
  var img = new Image();
  img.src = '../data/self_tank.png';
  context.drawImage(img, -15, -25);
  context.restore();
};

Drawing.drawOther = function(context, object) {
  context.save();
  context.translate(object.x_, object.y_);
  context.rotate(object.orientation_);
  var img = new Image();
  img.src = '../data/other_tank.png';
  context.drawImage(img, -15, -25);
  context.restore();
};
