/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export class scriptBuffer {
  static #buffer:Array<string>
  static #maxSize:number

  constructor() {
    scriptBuffer.#buffer = []
    scriptBuffer.#maxSize = 100
    return false
  }

  /**
   * Read the script buffer
   * @returns The entire buffer formatted as a single string
   */
  static read():string {
    let resStr = ''
    scriptBuffer.#buffer.forEach(str => resStr += `${str}\n\n`)
    return resStr
  }

  /**
   * Write to the script buffer
   * @param data Data to write
   */
  static write(data:string) {
    scriptBuffer.#buffer.push(data)
    if(scriptBuffer.#buffer.length > scriptBuffer.#maxSize)
      scriptBuffer.#buffer = scriptBuffer.#buffer.slice(-scriptBuffer.#maxSize)
  }

  /** Get the max buffer size */
  static get size():number { return scriptBuffer.#maxSize }
  /** Set the max buffer size */
  static set size(val:number) { scriptBuffer.#maxSize = val }
}
