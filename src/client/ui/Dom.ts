/**
 * Utilities for manipulating the DOM.
 * @author omgimanerd
 */

/**
 * Creates a HTMLElement of the given type and assigns it the given attributes.
 * @param element The string name of the HTMLElement to create
 * @param attributes The attributes to assign
 * @returns An initialized HTMLElement with the given attributes
 */
const createElement = <K extends keyof HTMLElementTagNameMap>(
  element: K,
  attributes: Record<string, any>,
): HTMLElementTagNameMap[K] => {
  const dom = document.createElement(element)
  for (const [key, value] of Object.entries(attributes)) {
    if (key in dom) {
      ;(dom as any)[key] = value
    } else {
      throw new Error(`${key} is not a valid attribute of ${dom}`)
    }
  }
  return dom
}

export default {
  createElement,
}
