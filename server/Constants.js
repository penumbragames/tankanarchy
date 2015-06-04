/**
 * This class stores global constants on the server, such as environment
 * size. The client will maintain its own version of this, so it's important
 * that if we change it server side, we also change it client side.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {}

/**
 * The world will always be a square, so there's no need for an x and y max.
 */
Constants.WORLD_MIN = 0;
Constants.WORLD_MAX = 2500;
Constants.WORLD_PADDING = 30;

module.exports = Constants;
