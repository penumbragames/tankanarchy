/**
 * @fileoverview Vector class for simple 2D physics manipulations.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

export default class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  /**
   * Returns a new Vector from polar coordinates r and theta.
   * @param r {number} Vector magnitude
   * @param theta {number} Vector angle in radians
   * @returns
   */
  static fromPolar(r: number, theta: number): Vector {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta))
  }

  static zero(): Vector {
    return new Vector(0, 0)
  }

  static one(): Vector {
    return new Vector(1, 1)
  }

  get angle(): number {
    return Math.atan2(this.y, this.x)
  }

  get mag(): number {
    return Math.sqrt(this.mag2)
  }

  get mag2(): number {
    return this.x ** 2 + this.y ** 2
  }

  get neg(): Vector {
    return new Vector(-this.x, -this.y)
  }

  copy(): Vector {
    return new Vector(this.x, this.y)
  }

  /**
   * Adds two vectors and returns a new Vector object without mutating the
   * arguments.
   */
  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
  }

  /**
   * Adds another Vector object to this one, returning this Vector for method
   * chaining.
   */
  add(other: Vector): Vector {
    this.x += other.x
    this.y += other.y
    return this
  }

  /**
   * Scales a given Vector by a scalar constant, returning a new Vector.
   */
  static scale(v: Vector, c: number): Vector {
    return new Vector(v.x * c, v.y * c)
  }

  /**
   * Scales this Vector by a scalar constant, returning this Vector for
   * method chaining.
   */
  scale(c: number): Vector {
    this.x *= c
    this.y *= c
    return this
  }

  /**
   * Subtracts one Vector from another, returning a new Vector.
   */
  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
  }

  /**
   * Subtracts another Vector from this Vector, returning this Vector for
   * method chaining.
   */
  sub(other: Vector): Vector {
    this.x -= other.x
    this.y -= other.y
    return this
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y
  }

  /**
   * Returns the vector projection of this Vector onto the argument Vector.
   * @param other The Vector to project onto.
   * @returns a new Vector containing the Vector projection.
   */
  proj(other: Vector): Vector {
    return Vector.scale(other, this.dot(other) / other.mag2)
  }

  toString(): string {
    return `<${this.x},${this.y}>`
  }
}
