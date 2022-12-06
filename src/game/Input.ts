/**
 * This class facilitates the tracking of user input, such as mouse clicks
 * and button presses.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Vector from '../lib/Vector'

class Input {
  up: boolean
  down: boolean
  left: boolean
  right: boolean

  mouseDown: boolean
  mouseCoords: Vector

  constructor() {
    this.up = false
    this.down = false
    this.left = false
    this.right = false

    this.mouseDown = false
    this.mouseCoords = Vector.zero()
  }

  static create(keyElement:HTMLElement, mouseMoveElement:HTMLElement):Input {
    const input = new Input()
    input.applyEventHandlers(keyElement, keyElement, mouseMoveElement)
    return input
  }

  /**
   * Key down event handler.
   * @param {Event} event The event passed to the event handler
   */
  onKeyDown(event:KeyboardEvent) {
    this.left = event.code === 'KeyA' || event.code === 'ArrowLeft'
    this.up = event.code === 'KeyW' || event.code === 'ArrowUp'
    this.right = event.code === 'KeyD' || event.code === 'ArrowRight'
    this.down = event.code === 'KeyS' || event.code === 'ArrowDown'
  }

  /**
   * Key up event handler.
   * @param {Event} event The event passed to the event handler
   */
  onKeyUp(event:KeyboardEvent) {
    this.left = !(event.code === 'KeyA' || event.code === 'ArrowLeft')
    this.up = !(event.code === 'KeyW' || event.code === 'ArrowUp')
    this.right = !(event.code === 'KeyD' || event.code === 'ArrowRight')
    this.down = !(event.code === 'KeyS' || event.code === 'ArrowDown')
  }

  /**
   * Mouse down event handler.
   * @param {Event} event The event passed to the event handler
   */
  onMouseDown(event:MouseEvent) {
    if (event.button === 1) {
      this.mouseDown = true
    }
  }

  /**
   * Mouse up event handler.
   * @param {Event} event The event passed to the event handler
   */
  onMouseUp(event:MouseEvent) {
    if (event.button === 1) {
      this.mouseDown = false
    }
  }

  /**
   * Mouse move event handler.
   * @param {Event} event The event passed to the event handler
   */
  onMouseMove(event:MouseEvent) {
    this.mouseCoords.x = event.offsetX
    this.mouseCoords.y = event.offsetY
  }

  /**
   * Applies the event handlers to elements in the DOM.
   * @param {Element} keyElement The element to track keypresses on
   * @param {Element} mouseClickElement The element to track mouse clicks on
   * @param {Element} mouseMoveElement The element to track mouse movement
   *   relative to
   */
  applyEventHandlers(keyElement:HTMLElement, mouseClickElement:HTMLElement,
                     mouseMoveElement:HTMLElement) {
    keyElement.addEventListener('keydown', this.onKeyDown.bind(this))
    keyElement.addEventListener('keyup', this.onKeyUp.bind(this))
    mouseClickElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    mouseClickElement.addEventListener('mouseup', this.onMouseUp.bind(this))
    mouseMoveElement.setAttribute('tabindex', '1')
    mouseMoveElement.addEventListener('mousemove', this.onMouseMove.bind(this))
  }
}

export default Input
