/**
 * @fileoverview Returns a JSON replacer and reviver function that allows for
 * registered classes to be serialized and deserialized from JSON objects.
 */

import 'reflect-metadata'

import { instanceToPlain, plainToInstance } from 'class-transformer'

// All possible serializable classes.
import Bullet from 'lib/game/entity/Bullet'
import Explosion from 'lib/game/entity/Explosion'
import Player from 'lib/game/entity/player/Player'
import Powerup from 'lib/game/entity/Powerup'
import Rocket from 'lib/game/entity/Rocket'
import Vector from 'lib/math/Vector'

const __type = '__type'

type SerializableTypes = {
  [key: string]: any
}

interface JSONReplacerReviver {
  replacer: (this: any, key: string, value: any) => any
  reviver: (this: any, key: string, value: any) => any
}

/**
 * Given an object containing the classes to be serialized/deserialized, this
 * function returns a replacer and reviver function that can be used with
 * JSON.stringify and JSON.parse which will allow for the classes to be
 * serialized into a JSON object and deserialized back into an instance of
 * themselves.
 *
 * The classes must not have a __type property defined since this will be
 * written into the object in order to preserve type information.
 *
 * @param types An object specifying the classes that the custom serialization
 * logic will apply to, best specified using the object shorthand notation as {
 * Class1, Class2 }.
 * @returns JSONReplacerReviver, an object with two keys storing the custom
 * replacer and reviver functions to be used with JSON.parse and JSON.stringify
 */
const getReplacerReviver = (types: SerializableTypes): JSONReplacerReviver => {
  return {
    replacer(_key: string, value: any): any {
      if (!value) return value
      if (Object.prototype.hasOwnProperty.call(value, __type)) {
        throw new Error(
          'Objects to be serialized cannot have a __typename__ property',
        )
      }
      // Fetch the object instance name if available and check if it is in the
      // list of special serializable types that we need to handle with
      // class-transformer.
      const className = value?.constructor?.name
      if (
        !className ||
        !(className in types) ||
        !(value instanceof types[className])
      ) {
        return value
      }
      // If so, serialize it with class-transformer's instanceToPlain and write
      // the type into the __type field.
      const plainObject = instanceToPlain(value)
      Object.defineProperty(plainObject, __type, {
        value: className,
        enumerable: true,
      })
      return plainObject
    },
    reviver(_key: string, value: any): any {
      if (!value) return value
      // Check if the object to deserialize has a __type field, with a
      // __type that is registered.
      const typenameProperty = Object.getOwnPropertyDescriptor(value, __type)
      if (!typenameProperty || !typenameProperty.value) return value
      if (!(typenameProperty.value in types)) {
        throw new Error(
          `Object to deserialize has a __type field with an unknown type ${typenameProperty.value}`,
        )
      }
      // Remove the __type field and deserialize it with class-transformer's
      // plainToInstance.
      delete value[__type]
      // plainToInstance will call the class constructor under the hood before
      // replacing its fields. If the constructor performs some initialization
      // on a field that is @Excluded, the initialized field will remain in the
      // deserialized class.
      return plainToInstance(types[typenameProperty.value], value)
    },
  }
}

// Export replacer and reviver functions for all the classes in this project
// that we are sending over the wire. Only the top level classes that we are
// calling instanceToPlain on need to be registered here. If a class is composed
// within another class and not sent on its own, it does not need to be
// registered.
export const { replacer, reviver } = getReplacerReviver({
  Bullet,
  Explosion,
  Player,
  Powerup,
  Rocket,
  Vector,
})
