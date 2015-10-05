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
    context.receiveMessage(data);
  });
};

Chat.prototype.receiveMessage = function(message) {
  var element = document.createElement('li');
  element.appendChild(document.createTextNode(message));
  this.displayElement.appendChild(element);
};

Chat.prototype.sendMessage = function() {
  var text = this.textElement.value;
  this.textElement.value = '';
  this.socket.emit('chat-client-to-server', text);
};
