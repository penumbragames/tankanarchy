/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Drawing() {}

Drawing.drawSelf = function(context, object) {
  context.fillStyle = 'red';
  context.fillRect(object.x_ - 5, object.y_ - 5, 10, 10);
};

Drawing.drawOther = function(context, object) {
  context.fillStyle = 'black';
  context.fillRect(object.x_ - 5, object.y_ - 5, 10, 10);
};
