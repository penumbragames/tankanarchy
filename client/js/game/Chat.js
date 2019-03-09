/**
 * This class handles the sending and receiving of chat messages as well as
 * their display. Chat messages will use the same socket as the game.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * Constructor for the Chat class.
 * @constructor
 * @param {Object} socket The socket connected to the server.
 * @param {Element} displayElement The element in which the chat will be
 *   displayed.
 * @param {Element} textElement The input element from which text will be read
 *   to be sent as a chat message to the server.
 */
function Chat(socket, displayElement, textElement) {
  this.socket = socket;

  this.displayElement = displayElement;
  this.textElement = textElement;
}

/**
 * Factory method to create a Chat object.
 * @param {Object} socket The socket connected to the server.
 * @param {Element} displayElement The element in which the chat will be
 *   displayed.
 * @param {Element} textElement The input element from which text will be read
 *   to be sent as a chat message to the server.
 * @return {Chat}
 */
Chat.create = function(socket, displayElement, textElement) {
  var chat = new Chat(socket, displayElement, textElement);
  chat.init();
  return chat;
};

/**
 * Binds the event handlers. This should be called during the initialization
 * in client.js.
 */
Chat.prototype.init = function() {
  this.textElement.addEventListener('keydown', bind(this, function(e) {
    if (e.keyCode == 13) {
      this.sendMessage();
    }
  }));

  this.socket.on('chat-server-to-clients', bind(this, function(data) {
    this.receiveMessage(data['name'], data['message'], data['isNotification']);
  }));
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
