/**
 * This class handles the sending and receiving of chat messages as well as
 * their display. Chat messages will use the same socket as the game.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * Constructor for the Chat class.
 * @constructor
 */
function Chat(socket, displayElement, textElement) {
  this.socket = socket;

  this.displayElement = displayElement;
  this.textElement = textElement;
}

/**
 * Binds the event handlers. This should be called during the initialization
 * in client.js.
 */
Chat.prototype.init = function() {
  var context = this;

  this.textElement.onkeydown = function(e) {
    if (e.keyCode == 13) {
      context.sendMessage();
    }
  }

  this.socket.on('chat-server-to-clients', function(data) {
    context.receiveMessage(data.name, data.message, data.isNotification);
  });
};

/**
 * This is called when a message is received, and will display the new
 * received message.
 * @param {string} name The name of the message sender.
 * @param {string} message The content of the message.
 * @param {boolean} isNotification Whether or not this message is an
 *   administrative notification.
 */
Chat.prototype.receiveMessage = function(name, message, isNotification) {
  var element = document.createElement('li');
  if (isNotification) {
    element.setAttribute('class', 'notification');
  }
  element.appendChild(document.createTextNode(name + ': ' + message));
  this.displayElement.appendChild(element);
};

/**
 * This is called when the user presses enter in the chatbox, and takes care
 * of taking the message they typed and sending it to the server to be relayed
 * to other clients.
 */
Chat.prototype.sendMessage = function() {
  var text = this.textElement.value;
  this.textElement.value = '';
  this.socket.emit('chat-client-to-server', text);
};
