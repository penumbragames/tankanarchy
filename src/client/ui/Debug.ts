/**
 * Debug is a singleton class hooked to a UI element that allows us to trigger
 * debug commands from the client or display debug information.
 * @author omgimanerd
 */

import type { Optional } from 'lib/types/types'

import Dom from 'client/ui/Dom'
import POWERUPS from 'lib/enums/Powerups'
import { IUpdateableClient, UpdateFrame } from 'lib/game/component/Updateable'
import { SocketClient } from 'lib/socket/SocketClient'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

export default class Debug implements IUpdateableClient {
  static instance: Optional<Debug>

  socket: SocketClient

  container: HTMLElement
  powerupButtonContainer: HTMLElement
  displayContainer: HTMLElement

  // Values to display on the debug dashboard.
  display: Map<string, any> = new Map()
  debugHitboxes: boolean = false // toggled by UI element

  constructor(
    socket: SocketClient,
    container: HTMLElement,
    powerupButtonContainer: HTMLElement,
    displayContainer: HTMLElement,
  ) {
    this.socket = socket
    this.container = container
    this.powerupButtonContainer = powerupButtonContainer
    this.displayContainer = displayContainer
  }

  static init(
    socket: SocketClient,
    container: HTMLElement,
    powerupButtonContainer: HTMLElement,
    displayContainer: HTMLElement,
  ) {
    Debug.instance = new Debug(
      socket,
      container,
      powerupButtonContainer,
      displayContainer,
    )
    if (DEBUG) {
      Debug.instance.buildUI()
    } else {
      container.hidden = true
    }
  }

  static get(): Debug {
    if (!Debug.instance) {
      throw new Error('Debug singleton has not been initialized.')
    }
    return Debug.instance
  }

  // Called once during initialization to populate the powerup buttons in the
  // UI.
  buildUI() {
    for (const type of Object.keys(POWERUPS)) {
      const button = Dom.createElement('button', {
        textContent: type,
        onclick: () => {
          this.socket.emit(SOCKET_EVENTS.DEBUG, {
            socketId: this.socket.id!,
            applyPowerup: <POWERUPS>type,
          })
        },
      })
      this.powerupButtonContainer.appendChild(button)
    }
    this.powerupButtonContainer.appendChild(document.createElement('br'))

    const hitboxToggle = Dom.createElement('input', {
      id: 'debug-hitboxes-toggle',
      type: 'checkbox',
      onchange: (e: Event) => {
        this.debugHitboxes = (e.target as HTMLInputElement).checked
      },
    })
    const hitboxToggleLabel = Dom.createElement('label', {
      htmlFor: 'debug-hitboxes-toggle',
      textContent: 'Toggle Hitboxes',
    })

    this.powerupButtonContainer.appendChild(hitboxToggle)
    this.powerupButtonContainer.appendChild(hitboxToggleLabel)
  }

  // Updates the display UI elements
  update(_updateFrame: UpdateFrame) {
    this.displayContainer.innerHTML = [...this.display.entries()]
      .map((kv) => `${kv[0]}=${kv[1]}`)
      .join('<br />')
  }

  setDisplayValue(key: string, value: any) {
    this.display.set(key, value)
  }
}
