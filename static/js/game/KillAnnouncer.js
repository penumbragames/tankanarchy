/**
 * This class manages the kill messages at the top of the screen.
 * When a player is killed, the corresponding message will be
 * displayed.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the KillAnnouncer class.
 * @constructor
 * @param {Element} feed The element that will serve as the container
 *   for the kill messages.
 */
function KillAnnouncer(feed) {
  this.feed = feed;
};
