/**
 * This class facilitates the tracking of user input, such as mouse clicks
 * and button presses.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Vector from 'lib/math/Vector'

class Input {
  static readonly MOUSE_LEFT = 0
  static readonly MOUSE_MIDDLE = 1
  static readonly MOUSE_RIGHT = 2

  up: boolean = false
  down: boolean = false
  left: boolean = false
  right: boolean = false

  mouseLeftDown: boolean = false
  mouseRightDown: boolean = false
  mouseCoords: Vector = Vector.zero()

  static create(
    keyElement: HTMLElement,
    mouseTrackerElement: HTMLElement,
  ): Input {
    const input = new Input()
    input.applyEventHandlers(keyElement, <HTMLElement>mouseTrackerElement)
    return input
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.left = true
        break
      case 'KeyW':
      case 'ArrowUp':
        this.up = true
        break
      case 'KeyD':
      case 'ArrowRight':
        this.right = true
        break
      case 'KeyS':
      case 'ArrowDown':
        this.down = true
        break
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyA':
      case 'ArrowLeft':
        this.left = false
        break
      case 'KeyW':
      case 'ArrowUp':
        this.up = false
        break
      case 'KeyD':
      case 'ArrowRight':
        this.right = false
        break
      case 'KeyS':
      case 'ArrowDown':
        this.down = false
        break
    }
  }

  onMouseDown(event: MouseEvent): void {
    switch (event.button) {
      case Input.MOUSE_LEFT:
        this.mouseLeftDown = true
        break
      case Input.MOUSE_RIGHT:
        this.mouseRightDown = true
        break
    }
  }

  onMouseUp(event: MouseEvent): void {
    switch (event.button) {
      case Input.MOUSE_LEFT:
        this.mouseLeftDown = false
        break
      case Input.MOUSE_RIGHT:
        this.mouseRightDown = false
        break
    }
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseCoords = new Vector(event.offsetX, event.offsetY)
  }

  /**
   * Applies the event handlers to elements in the DOM.
   * @param {HTMLElement} keyElement The element to track keypresses on
   * @param {HTMLElement} mouseTrackerElement The element to track mouse clicks
   *   and movement on, mouse coordinates will be tracked relative to this
   *   element.
   */
  applyEventHandlers(
    keyElement: HTMLElement,
    mouseTrackerElement: HTMLElement,
  ): void {
    keyElement.addEventListener('keydown', this.onKeyDown.bind(this))
    keyElement.addEventListener('keyup', this.onKeyUp.bind(this))
    mouseTrackerElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this),
    )
    mouseTrackerElement.addEventListener('mouseup', this.onMouseUp.bind(this))
    mouseTrackerElement.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this),
    )
  }
}

export default Input
