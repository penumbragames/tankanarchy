/**
 * Reloads the page if the player has been afk for more than 1 minute.
 * This essentially kicks them from the game since it will fire the socket
 * disconnect event.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Empty constructor for the AFK object.
 * @constructor
 */
function AFK() {}

/**
 * AFK kicker constants.
 */
AFK.TIMER = 0;
AFK.KICK_TIME = 120000;

/**
 * Initializes the AFK kicker, must be called when the game starts.
 */
AFK.init = function() {
  AFK.TIMER = (new Date).getTime();
  window.addEventListener('click', AFK.resetTimer);
  window.addEventListener('mousemove', AFK.resetTimer);
  window.addEventListener('keydown', AFK.resetTimer);
};

/**
 * Checks the timer and reloads the page if the player is determined
 * to be AFK.
 */
AFK.check = function() {
  if ((new Date).getTime() > AFK.TIMER + AFK.KICK_TIME) {
    location.reload();
  }
};

/**
 * Resets the AFK kick timer. Bound to click and key actions so that
 * the player will reset the timer whenever they move or shoot.
 */
AFK.resetTimer = function() {
  AFK.TIMER = (new Date).getTime();
};
