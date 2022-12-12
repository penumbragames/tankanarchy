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
  canvasOffset: Vector

  constructor() {
    this.up = false
    this.down = false
    this.left = false
    this.right = false

    this.mouseDown = false
    this.mouseCoords = Vector.zero()
    this.canvasOffset = Vector.zero()
  }

  static create(
    keyElement: HTMLElement,
    mouseTrackerElement: HTMLCanvasElement,
  ): Input {
    const input = new Input()
    input.applyEventHandlers(keyElement, mouseTrackerElement)
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
    if (event.button === 0) {
      this.mouseDown = true
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      this.mouseDown = false
    }
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseCoords = new Vector(event.offsetX, event.offsetY).sub(
      this.canvasOffset,
    )
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
    mouseTrackerElement: HTMLCanvasElement,
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
    this.canvasOffset = new Vector(
      mouseTrackerElement.offsetLeft,
      mouseTrackerElement.offsetTop,
    )
  }
}

export default Input
