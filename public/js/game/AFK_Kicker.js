/**
 * Reloads the page if the player has been AFK.
 * This essentially kicks them from the game since it will fire the socket
 * disconnect event.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Constructor for the AFK_Kicker class.
 * @constructor
 */
function AFK_Kicker() {}

/**
 * This is the timer for AFK_Kicker.
 */
AFK_Kicker.TIMER = 0;

/**
 * This is the time in milliseconds that must elapse before the player is
 * kicked.
 */
AFK_Kicker.KICK_TIME = 120000;

/**
 * Initializes the AFK_Kicker kicker, must be called when the game starts.
 */
AFK_Kicker.init = function() {
  AFK_Kicker.TIMER = (new Date).getTime();
  window.addEventListener('click', AFK_Kicker.resetTimer);
  window.addEventListener('mousemove', AFK_Kicker.resetTimer);
  window.addEventListener('keydown', AFK_Kicker.resetTimer);
  window.addEventListener('keyup', AFK_Kicker.resetTimer);
};

/**
 * Checks the timer and reloads the page if the player is determined
 * to be AFK.
 */
AFK_Kicker.check = function() {
  if ((new Date()).getTime() > AFK_Kicker.TIMER + AFK_Kicker.KICK_TIME) {
    location.reload();
  }
};

/**
 * Resets the AFK_Kicker kick timer. Bound to click and key actions so that
 * the player will reset the timer whenever they move or shoot.
 */
AFK_Kicker.resetTimer = function() {
  AFK_Kicker.TIMER = (new Date()).getTime();
};
