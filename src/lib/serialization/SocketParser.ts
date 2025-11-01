/**
 * @fileoverview Custom JSON replacer and reviver functions which allow for ES6
 * Maps to be serialized and deserialized from JSON objects for sending across
 * the wire through socket.io.
 */

import * as socketIOParser from 'socket.io-parser'

import { getReplacerReviver } from 'lib/serialization/ReplacerReviver'

import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import Powerup from 'lib/game/Powerup'
import Vector from 'lib/math/Vector'

// All the custom serializable classes that should be preserved when sent over
// the socket are listed here.
const { replacer, reviver } = getReplacerReviver({
  Bullet,
  Player,
  Powerup,
  Vector,
})

/**
 * Subclass of the default socket-io.parser encoder that can be used as a
 * drop-in replacement.
 */
class Encoder extends socketIOParser.Encoder {
  constructor() {
    super(replacer)
  }
}

/**
 * Subclass of the default socket-io.parser decoder that can be used as a
 * drop-in replacement.
 */
class Decoder extends socketIOParser.Decoder {
  constructor() {
    super(reviver)
  }
}

export default {
  Encoder,
  Decoder,
}
