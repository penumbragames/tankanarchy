/**
 * @fileoverview Returns a JSON replacer and reviver function that allows for
 * registered classes to be serialized and deserialized from JSON objects.
 */

import { instanceToPlain, plainToInstance } from 'class-transformer'

const __typename__ = '__typename__'

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
 * The classes must not have a __typename__ property defined since this will be
 * written into the object in order to preserve type information.
 *
 * @param types An object specifying the classes that the custom serialization
 * logic will apply to, best specified using the object shorthand notation as {
 * Class1, Class2 }.
 * @returns JSONReplacerReviver, an object with two keys storing the custom
 * replacer and reviver functions to be used with JSON.parse and JSON.stringify
 */
export function getReplacerReviver(
  types: SerializableTypes,
): JSONReplacerReviver {
  return {
    replacer(_key: string, value: any): any {
      if (!value) return value
      if (Object.prototype.hasOwnProperty.call(value, __typename__)) {
        throw new Error(
          'Objects to be serialized cannot have a __typename__ property',
        )
      }
      for (const [typename, type] of Object.entries(types)) {
        if (value instanceof type) {
          const plainObject = instanceToPlain(value)
          Object.defineProperty(plainObject, __typename__, {
            value: typename,
            enumerable: true,
          })
          return plainObject
        }
      }
      return value
    },
    reviver(_key: string, value: any): any {
      if (!value) return value
      const typenameProperty = Object.getOwnPropertyDescriptor(
        value,
        __typename__,
      )
      if (!typenameProperty || !typenameProperty.value) return value
      return plainToInstance(types[typenameProperty.value], value)
    },
  }
}
