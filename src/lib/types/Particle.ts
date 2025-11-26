/**
 * Types and interfaces for particle rendering.
 * @author omgimanerd
 */

export enum PARTICLE_DRAWING_LAYER {
  PRE_ENTITY = 'PRE_ENTITY',
  POST_ENTITY = 'POST_ENTITY',
}

// Particle drawing options
export type ParticleDrawingOptions = {
  layer: PARTICLE_DRAWING_LAYER
  animated?: boolean
  size?: number
  angle?: number
  fadeOut?: boolean
  startTime?: number
  expirationTime?: number
}
