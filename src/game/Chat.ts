/**
 * This class handles the sending and receiving of chat messages as well as
 * their display. Chat messages will use the same socket as the game.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import * as socketIO from 'socket.io-client'

class Chat {
  socket: socketIO.Socket
  displayElement: HTMLElement
  inputElement: HTMLInputElement

  constructor(socket: socketIO.Socket, displayElement: HTMLElement,
              inputElement: HTMLInputElement) {
    this.socket = socket
    this.displayElement = displayElement
    this.inputElement = inputElement
  }

  static create(socket: socketIO.Socket, displayElementID: string,
                inputElementID: string) {
    const displayElement = document.getElementById(displayElementID)!
    const inputElement = document.getElementById(inputElementID)!
    if (!(inputElement instanceof HTMLInputElement)) {
      throw new Error(`Input element ID ${inputElementID}`)
    }
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
    this.socket.on(Constants.SOCKET.CHAT_SERVER_CLIENT,
                   this.onChatReceive.bind(this))
  }

  /**
   * Event handler for a key down event on the input chat element.
   */
  onInputKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      const text = this.inputElement.value
      this.inputElement.value = ''
      this.socket.emit(Constants.SOCKET.CHAT_CLIENT_SERVER, text)
    }
  }

  /**
   * Event handler for a socket message received for a chat message.
   * @param {Object} data The data sent from the server
   */
  onChatReceive(data: Constants.CHAT_MESSAGE) {
    const element = document.createElement('li')
    if (data.isNotification) {
      element.setAttribute('class', 'notification')
    }
    element.appendChild(
      document.createTextNode(`${data.name}: ${data.message}`),
    )
    this.displayElement.appendChild(element)
  }
}

export default Chat
