/**
 * Types and interfaces for particle rendering.
 * @author omgimanerd
 */

import { Particle } from 'client/particle/Particle'

export enum ParticleDrawingLayer {
  PRE_ENTITY = 'PRE_ENTITY',
  POST_ENTITY = 'POST_ENTITY',
}

export type ParticleLayers = {
  [ParticleDrawingLayer.PRE_ENTITY]: Particle[]
  [ParticleDrawingLayer.POST_ENTITY]: Particle[]
}

// Particle drawing options
export type ParticleDrawingOptions = {
  layer: ParticleDrawingLayer
  animated?: boolean
  size?: number
  angle?: number
  fadeOut?: boolean
  startTime?: number
  expirationTime?: number
}
