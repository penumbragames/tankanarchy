/**
 * @fileoverview Custom JSON replacer and reviver functions which allow for ES6
 * Maps to be serialized and deserialized from JSON objects for sending across
 * the wire through socket.io.
 */

import * as socketIOParser from 'socket.io-parser'
import Vector from '../lib/Vector'
import { getReplacerReviver } from './CustomObjectSerialization'

const { replacer, reviver } = getReplacerReviver({ Vector })

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

/* eslint-enable @typescript-eslint/no-explicit-any */
