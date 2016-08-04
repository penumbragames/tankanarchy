/**
 * This class manages the kill messages at the top of the screen.
 * When a player is killed, the corresponding message will be
 * displayed.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Constructor for the KillAnnouncer class.
 * @constructor
 * @param {Element} feed The element that will serve as the container
 *   for the kill messages.
 */
function KillAnnouncer(feed) {
  this.feed = feed;
}
