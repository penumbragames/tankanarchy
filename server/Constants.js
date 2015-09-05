/**
 * This class stores global constants on the server, such as environment
 * size. The client will maintain its own version of this, so it's important
 * that if we change it server side, we also change it client side.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * @todo Find a better way to maintain constants between the client and server.
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
};

/**
 * The world will always be a square, so there's no need for an x and y max.
 * WORLD and CANVAS constants should mirror those in the client side
 * JavaScript.
 * All values are in pixels.
 */
Constants.WORLD_MIN = 0;
Constants.WORLD_MAX = 2500;
Constants.WORLD_PADDING = 30;
Constants.CANVAS_WIDTH = 800;
Constants.CANVAS_HEIGHT = 600;
// x = (width / 2) + 25
// y = (height / 2) + 25
Constants.VISIBILITY_THRESHOLD_X = 425;
Constants.VISIBILITY_THRESHOLD_Y = 325;

module.exports = Constants;
