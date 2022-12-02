/**
 * This class handles the sending and receiving of chat messages as well as
 * their display. Chat messages will use the same socket as the game.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('../../../lib/Constants')

/**
 * Chat class.
 */
class Chat {
  /**
   * Constructor for the Chat class, which handles sending and receiving chat
   * from the clients.
   * @param {Socket} socket The socket connected to the server
   * @param {Element} displayElement The element in which the chat will
   *   displayed
   * @param {Element} inputElement The input element from which chat will be
   *   read to be sent to the server
   */
  constructor(socket, displayElement, inputElement) {
    this.socket = socket
    this.displayElement = displayElement
    this.inputElement = inputElement
  }

  /**
   * Factory method to create a Chat class.
   * @param {Socket} socket The socket connected to the server
   * @param {Element} displayElementID The ID of the display element
   * @param {Element} inputElementID The ID of the input element
   * @return {Chat}
   */
  static create(socket, displayElementID, inputElementID) {
    const displayElement = document.getElementById(displayElementID)
    const inputElement = document.getElementById(inputElementID)
    const chat = new Chat(socket, displayElement, inputElement)
    chat.init()
    return chat
  }

  /**
   * Binds the event handlers to initialize the Chat class.
   */
  init() {
    this.inputElement.addEventListener('keydown',
      this.onInputKeyDown.bind(this))
    this.socket.on(Constants.SOCKET_CHAT_SERVER_CLIENT,
      this.onChatReceive.bind(this))
  }

  /**
   * Event handler for a key down event on the input chat element.
   * @param {Event} event The event passed to the event handler
   */
  onInputKeyDown(event) {
    if (event.keyCode === 13) {
      const text = this.inputElement.value
      this.inputElement.value = ''
      this.socket.emit(Constants.SOCKET_CHAT_CLIENT_SERVER, text)
    }
  }

  /**
   * Event handler for a socket message received for a chat message.
   * @param {Object} data The data sent from the server
   */
  onChatReceive(data) {
    const element = document.createElement('li')
    if (data.isNotification) {
      element.setAttribute('class', 'notification')
    }
    element.appendChild(
      document.createTextNode(`${data.name}: ${data.message}`))
    this.displayElement.appendChild(element)
  }
}

module.exports = Chat
