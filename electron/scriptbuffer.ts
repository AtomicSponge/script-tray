/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export class scriptbuffer {
  static #buffer:Array<string>
  static #maxSize:number

  constructor() {
    scriptbuffer.#buffer = []
    scriptbuffer.#maxSize = 100
    return false
  }

  /**
   * Read the script buffer
   * @returns The entire buffer formatted as a single string
   */
  static read():string {
    let resStr = ''
    scriptbuffer.#buffer.forEach(str => resStr += `${str}\n\n`)
    return resStr
  }

  /**
   * Write to the script buffer
   * @param data Data to write
   */
  static write(data:string) {
    scriptbuffer.#buffer.push(data)
    if(scriptbuffer.#buffer.length > scriptbuffer.#maxSize)
      scriptbuffer.#buffer = scriptbuffer.#buffer.slice(-scriptbuffer.#maxSize)
  }

  /** Get the max buffer size */
  static get size():number { return scriptbuffer.#maxSize }
  /** Set the max buffer size */
  static set size(val:number) { scriptbuffer.#maxSize = val }
}
