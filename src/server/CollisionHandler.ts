/**
 * Component used by the server side game to perform collision checks and call
 * the internal collision logic of colliding entities.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'

import Bullet from 'lib/game/entity/Bullet'
import Entity from 'lib/game/entity/Entity'
import Explosion from 'lib/game/entity/Explosion'
import Player from 'lib/game/entity/Player'
import Powerup from 'lib/game/entity/Powerup'
import Rocket from 'lib/game/entity/Rocket'
import { Constructor } from 'lib/types'
import { GameServices } from 'server/GameServices'

const noop = (_: Entity, __: Entity) => {}

const destroy = (services: GameServices) => {
  return function (e1: Entity, e2: Entity) {
    e1.destroy(services)
    e2.destroy(services)
  }
}

/**
 * CollisionEvent represents a single collision event between two entities and
 * allows a handler function to be registered with the colliding entities in
 * any order.
 */
class CollisionEvent {
  e1: Entity
  e2: Entity

  constructor(e1: Entity, e2: Entity) {
    this.e1 = e1
    this.e2 = e2
  }

  handle<T1 extends Entity, T2 extends Entity>(
    c1: Constructor<T1>,
    c2: Constructor<T2>,
    fn: (e1: T1, e2: T2) => void,
  ): boolean {
    if (this.e1 instanceof c1 && this.e2 instanceof c2) {
      fn(<T1>this.e1, <T2>this.e2)
      return true
    } else if (this.e1 instanceof c2 && this.e2 instanceof c1) {
      fn(<T1>this.e2, <T2>this.e1)
      return true
    }
    return false
  }
}

export default class CollisionHandler {
  services: GameServices
  handlers: any

  constructor(services: GameServices) {
    this.services = services
  }

  run(entities: Entity[]): void {
    // TODO: Use quadtree for collision update
    for (let i = 0; i < entities.length; ++i) {
      for (let j = i + 1; j < entities.length; ++j) {
        let e1 = entities[i]
        let e2 = entities[j]
        if (e1 !== e2 && e1.hitbox.collided(e2.hitbox)) {
          this.handleCollision(new CollisionEvent(e1, e2))
        }
      }
    }
  }

  private handleCollision(e: CollisionEvent): void {
    if (
      // Player collisions
      e.handle(Player, Bullet, (p: Player, b: Bullet) => {
        if (b.source === p) return
        p.damage(b.damage, b.source)
        console.log('damage triggered')
        b.destroy(this.services)
        this.services.playSound(SOUNDS.EXPLOSION, p.physics.position)
      }) ||
      e.handle(Player, Explosion, (p: Player, e: Explosion) => {
        if (e.tryDamage(p)) {
          p.damage(e.damage, e.source)
        }
      }) ||
      e.handle(Player, Powerup, (p: Player, po: Powerup) => {
        switch (p.applyPowerup(po)) {
          case POWERUPS.HEALTH_PACK:
            this.services.playSound(SOUNDS.HEALTH_PACK, p.physics.position)
            break
          case POWERUPS.RAPIDFIRE:
          case POWERUPS.SHOTGUN:
            this.services.playSound(SOUNDS.GUN_POWERUP, p.physics.position)
            break
        }
        po.destroy(this.services)
      }) ||
      e.handle(Player, Player, noop) ||
      e.handle(Player, Rocket, (p: Player, r: Rocket) => {
        if (r.source === p) return
        p.damage(r.damage, r.source)
        r.destroy(this.services)
        this.services.playSound(SOUNDS.EXPLOSION, p.physics.position)
      }) ||
      // Bullet collisions
      e.handle(Bullet, Explosion, (b: Bullet, e: Explosion) => {
        b.destroy(this.services)
      }) ||
      e.handle(Bullet, Bullet, (b1: Bullet, b2: Bullet) => {
        if (b1.source === b2.source) return
        b1.destroy(this.services)
        b2.destroy(this.services)
        this.services.playSound(SOUNDS.EXPLOSION, b1.physics.position)
        this.services.addParticle(PARTICLES.EXPLOSION, b1.physics.position, {})
      }) ||
      e.handle(Bullet, Powerup, (b: Bullet, po: Powerup) => {
        b.destroy(this.services)
        po.destroy(this.services)
        this.services.playSound(SOUNDS.EXPLOSION, b.physics.position)
        this.services.addParticle(PARTICLES.EXPLOSION, b.physics.position, {})
      }) ||
      // Rocket collisions
      e.handle(Rocket, Bullet, destroy(this.services)) ||
      e.handle(Rocket, Explosion, (r: Rocket, _e: Explosion) => {
        r.destroy(this.services)
      }) ||
      e.handle(Rocket, Rocket, destroy(this.services)) ||
      e.handle(Rocket, Powerup, destroy(this.services)) ||
      // Powerup collisions
      e.handle(Powerup, Explosion, (po: Powerup, _e: Explosion) => {
        po.destroy(this.services)
      }) ||
      e.handle(Powerup, Powerup, noop) ||
      // Explosion collisions with each other
      e.handle(Explosion, Explosion, noop)
    ) {
      return
    }
    throw new Error(`Unhandled CollisionEvent between ${e.e1} and ${e.e2}`)
  }
}
