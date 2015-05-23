/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing() {}

Drawing.drawSelf = function(context, object) {
  context.save();
  console.log(object.orientation_);
  context.translate(object.x_, object.y_);
  context.rotate(object.orientation_);
  context.fillStyle = 'red';
  context.fillRect(-4, -6, 8, 12);
  context.restore();
};

Drawing.drawOther = function(context, object) {
  context.save();
  console.log(object.orientation_);
  context.translate(object.x_, object.y_);
  context.rotate(object.orientation_);
  context.fillStyle = 'black';
  context.fillRect(-4, -6, 8, 12);
  context.restore();
};
