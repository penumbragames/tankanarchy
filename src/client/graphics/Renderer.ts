/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

import * as Constants from 'lib/Constants'
import POWERUPS from 'lib/enums/Powerups'
import SPRITES from 'lib/enums/Sprites'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import {
  PARTICLE_SPRITES,
  POWERUP_SPRITES,
  SPRITE_MAP,
} from 'client/graphics/Sprites'

import Canvas from 'client/graphics/Canvas'
import { newCanvasState } from 'client/graphics/Utils'
import Viewport from 'client/graphics/Viewport'
import Input from 'client/Input'
import Particle from 'client/particle/Particle'
import { Projectile } from 'lib/game/component/Projectile'
import Bullet from 'lib/game/entity/Bullet'
import Entity from 'lib/game/entity/Entity'
import Explosion from 'lib/game/entity/Explosion'
import Player from 'lib/game/entity/player/Player'
import Powerup from 'lib/game/entity/Powerup'
import Rocket from 'lib/game/entity/Rocket'
import Vector from 'lib/math/Vector'

export default class Renderer {
  static readonly NAME_FONT = '14px Helvetica'
  static readonly NAME_COLOR = 'black'

  static readonly HP_COLOR = '#ce0a17ff'
  static readonly HP_MISSING_COLOR = 'grey'
  static readonly TILE_SIZE = 100

  static readonly DEFAULT_PADDING = 10
  static readonly POWERUP_FADE_CUTOFF = 3
  static readonly POWERUP_FADE_EXPONENTIAL = 50
  static readonly POWERUP_BUFF_SIZE = 40

  canvas: Canvas
  context: CanvasRenderingContext2D
  viewport: Viewport

  constructor(canvas: Canvas, viewport: Viewport) {
    this.canvas = canvas
    this.context = canvas.context
    this.viewport = viewport
  }

  static create(canvas: Canvas, viewport: Viewport): Renderer {
    return new Renderer(canvas, viewport)
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawDebugHitbox(e: Entity): void {
    if (DEBUG && false) {
      this.context.beginPath()
      const canvasCoords = this.viewport.toCanvas(e.physics.position)
      this.context.arc(
        canvasCoords.x,
        canvasCoords.y,
        e.hitbox.size,
        0,
        2 * Math.PI,
        false,
      )
      this.context.strokeStyle = 'red'
      this.context.lineWidth = 3
      this.context.stroke()
    }
  }

  /**
   * Draws a player to the canvas as a tank.
   * @param {boolean} isSelf If this is true, then a green tank will be draw
   *   to denote the player's tank. Otherwise a red tank will be drawn to
   *   denote an enemy tank.
   * @param {Player} player The player object to draw.
   */
  drawTank(isSelf: boolean, player: Player): void {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(player.physics.position)
    // The canvas is already translated to the center of the player coordinate,
    // so all further sprite rendering should be done with that in mind.
    this.context.translate(canvasCoords.x, canvasCoords.y)

    this.context.textAlign = 'center'
    this.context.font = Renderer.NAME_FONT
    this.context.fillStyle = Renderer.NAME_COLOR
    this.context.fillText(player.name, 0, -50)
    for (let i = 0; i < 10; ++i) {
      if (i < player.health) {
        this.context.fillStyle = Renderer.HP_COLOR
      } else {
        this.context.fillStyle = Renderer.HP_MISSING_COLOR
      }
      this.context.fillRect(-25 + (5 * i), -40, 5, 4) // prettier-ignore
    }

    const tankSprite = isSelf
      ? SPRITE_MAP[SPRITES.SELF_TANK]
      : SPRITE_MAP[SPRITES.OTHER_TANK]
    tankSprite.draw(this.context, { centered: true, angle: player.tankAngle })
    const turretSprite = isSelf
      ? SPRITE_MAP[SPRITES.SELF_TURRET]
      : SPRITE_MAP[SPRITES.OTHER_TURRET]
    turretSprite.draw(this.context, {
      centered: true,
      angle: player.turretAngle,
    })

    if (player.getPowerupState(POWERUPS.SHIELD)) {
      SPRITE_MAP[SPRITES.SHIELD].draw(this.context, {
        size: PLAYER_CONSTANTS.SHIELD_HITBOX_SIZE * 2,
        centered: true,
      })
    }

    this.context.restore()
    this.drawDebugHitbox(player)
  }

  getBuffAlpha(remainingSeconds: number): number {
    return (
      Math.sin(Renderer.POWERUP_FADE_EXPONENTIAL / remainingSeconds) / 2 + 0.5
    )
  }

  /**
   * Draws the status of the current player's buffs to the top right.
   * @param {Player} self
   */
  drawBuffStatus(self: Player): void {
    // Iterate through the powerup types to render them in a deterministic
    // order.
    let offset =
      this.canvas.width - Renderer.DEFAULT_PADDING - Renderer.POWERUP_BUFF_SIZE
    for (const powerupType of Object.values(POWERUPS)) {
      // Healthpacks and rockets are not rendered in the buff status bar.
      if (
        powerupType === POWERUPS.HEALTH_PACK ||
        powerupType === POWERUPS.ROCKET
      ) {
        continue
      }
      let powerup
      if ((powerup = self.getPowerupState(powerupType))) {
        // Compute the alpha of the buff based on how close we are to expiring.
        // We only begin fading the buff close to actual expiration.
        const remainingSeconds = powerup.remainingSeconds
        POWERUP_SPRITES[powerupType].draw(this.context, {
          x: offset,
          y: Renderer.DEFAULT_PADDING,
          size: Renderer.POWERUP_BUFF_SIZE,
          opacity:
            remainingSeconds < Renderer.POWERUP_FADE_CUTOFF
              ? this.getBuffAlpha(remainingSeconds)
              : 1,
        })
        offset -= Renderer.POWERUP_BUFF_SIZE + Renderer.DEFAULT_PADDING
      }
    }
  }

  drawEntity(e: Entity): void {
    if (e instanceof Bullet || e instanceof Rocket) {
      this.drawProjectile(e)
    } else if (e instanceof Powerup) {
      this.drawPowerup(e)
    } else if (e instanceof Explosion) {
      this.drawDebugHitbox(e)
    } else {
      throw new Error(`Unknown entity ${e}`)
    }
  }

  drawProjectile(projectile: Projectile): void {
    const canvasCoords = this.viewport.toCanvas(projectile.physics.position)
    if (projectile instanceof Bullet) {
      SPRITE_MAP[SPRITES.BULLET].draw(this.context, {
        position: canvasCoords,
        centered: true,
        angle: projectile.angle,
      })
    } else if (projectile instanceof Rocket) {
      SPRITE_MAP[SPRITES.ROCKET].draw(this.context, {
        position: canvasCoords,
        // TODO: fix the underlying asset and make it animated
        width: 80,
        height: 10,
        centered: true,
        angle: projectile.angle,
      })
    }
    this.drawDebugHitbox(projectile)
  }

  drawPowerup(powerup: Powerup): void {
    const canvasCoords = this.viewport.toCanvas(powerup.physics.position)
    POWERUP_SPRITES[powerup.type].draw(this.context, {
      position: canvasCoords,
      size: powerup.hitbox.size * 2,
      centered: true,
    })
    this.drawDebugHitbox(powerup)
  }

  drawParticle(particle: Particle): void {
    const canvasCoords = this.viewport.toCanvas(particle.physics.position)
    PARTICLE_SPRITES[particle.type].draw(this.context, {
      position: canvasCoords,
      size: particle.options.size,
      centered: true,
      frame: particle.animation.frame,
    })
  }

  drawCrosshair(self: Player, input: Input): void {
    newCanvasState(this.context, () => {
      this.context.translate(input.mouseCoords.x, input.mouseCoords.y)
      this.context.beginPath()
      this.context.arc(
        0, // x
        0, // y
        10, // radius
        0, // startAngle
        2 * Math.PI, // endAngle
        false,
      )
      this.context.moveTo(0, 20)
      this.context.lineTo(0, -20)
      this.context.moveTo(-20, 0)
      this.context.lineTo(20, 0)

      this.context.strokeStyle = 'black'
      this.context.lineWidth = 1
      this.context.stroke()

      // Draw the number of rockets left to fire
      this.context.translate(20, 20)
      for (
        let i = 0;
        i < (self.getPowerupState(POWERUPS.ROCKET)?.rockets ?? 0);
        ++i
      ) {
        SPRITE_MAP[SPRITES.ROCKET].draw(this.context, {
          width: 20,
          height: 4,
          centered: true,
          angle: -Math.PI / 2,
        })
        this.context.translate(7, 0)
      }
    })
  }

  drawTiles(): void {
    const start = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MIN, Constants.WORLD_MIN),
    )
    const end = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MAX, Constants.WORLD_MAX),
    )
    for (let x = start.x; x < end.x; x += Renderer.TILE_SIZE) {
      for (let y = start.y; y < end.y; y += Renderer.TILE_SIZE) {
        SPRITE_MAP[SPRITES.TILE].draw(this.context, { x, y })
      }
    }
  }
}
