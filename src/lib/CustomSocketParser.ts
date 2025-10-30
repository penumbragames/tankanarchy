/**
 * @fileoverview Custom JSON replacer and reviver functions which allow for ES6
 * Maps to be serialized and deserialized from JSON objects for sending across
 * the wire through socket.io.
 */

import * as socketIOParser from 'socket.io-parser'

import { getReplacerReviver } from 'lib/serialization/ReplacerReviver'
import Vector from 'lib/Vector'
import Player from 'server/Player'
import Powerup from 'server/Powerup'

const { replacer, reviver } = getReplacerReviver({ Vector, Player, Powerup })

/**
 * Subclass of the default socket-io.parser encoder that can be used as a
 * drop-in replacement.
 */
export class Encoder extends socketIOParser.Encoder {
  constructor() {
    super(replacer)
  }
}

/**
 * Subclass of the default socket-io.parser decoder that can be used as a
 * drop-in replacement.
 */
export class Decoder extends socketIOParser.Decoder {
  constructor() {
    super(reviver)
  }
}
