/**
 * This class stores global constants between the client and server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error('Constants should not be instantiated!');
}

/**
 * The world will always be a square, so there's no need for an x and y max.
 * WORLD and CANVAS constants should mirror those in the client side
 * JavaScript.
 * All values are in pixels.
 */

/**
 * @const
 * @type {number}
 */
Constants.WORLD_MIN = 0;

/**
 * @const
 * @type {number}
 */
Constants.WORLD_MAX = 2500;

/**
 * @const
 * @type {number}
 */
Constants.WORLD_PADDING = 30;

/**
 * @const
 * @type {number}
 */
Constants.CANVAS_WIDTH = 800;

/**
 * @const
 * @type {number}
 */
Constants.CANVAS_HEIGHT = 600;

/**
 * Constants.VISIBILITY_THRESHOLD_X = (Constants.CANVAS_WIDTH / 2) + 25
 * @const
 * @type {number}
 */
Constants.VISIBILITY_THRESHOLD_X = 425;

/**
 * Constants.VISIBILITY_THRESHOLD_Y = (Constants.CANVAS_HEIGHT / 2) + 25
 * @const
 * @type {number}
 */
Constants.VISIBILITY_THRESHOLD_Y = 325;

if (typeof module === 'object') {
  /**
   * If Constants is loaded as a Node module, then this line is called.
   */
  module.exports = Constants;
} else {
  /**
   * If Constants is loaded into the browser, then this line is called.
   */
  window.Constants = Constants;
}
