/**
 * Wrapper class for HTMLCanvasElement to expose some more useful things.
 * @author omgimanerd (alvin@omgimanerd.tech)
 */

import Vector from 'lib/math/Vector'

export default class Canvas {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  static getFromId(id: string): Canvas {
    return new Canvas(document.getElementById(id) as HTMLCanvasElement)
  }

  matchCanvasSize() {
    this.width = this.elementWidth
    this.height = this.elementHeight
  }

  bindResizeListener() {
    window.addEventListener('resize', this.matchCanvasSize.bind(this), true)
  }

  get element() {
    return this.canvas
  }

  get context(): CanvasRenderingContext2D {
    return <CanvasRenderingContext2D>this.canvas.getContext('2d')
  }

  get width() {
    return this.canvas.width
  }

  set width(width: number) {
    this.canvas.width = width
  }

  get height() {
    return this.canvas.height
  }

  set height(height: number) {
    this.canvas.height = height
  }

  get center() {
    return new Vector(this.width / 2, this.height / 2)
  }

  get aspectRatio() {
    return this.width / this.height
  }

  get elementWidth() {
    return this.canvas.offsetWidth
  }

  get elementHeight() {
    return this.canvas.offsetHeight
  }

  get elementAspectRatio() {
    return this.elementWidth / this.elementHeight
  }

  get elementCenter() {
    return new Vector(this.elementWidth / 2, this.elementHeight / 2)
  }
}
