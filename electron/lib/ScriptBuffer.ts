/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export class ScriptBuffer {
  #buffer:Array<string>
  #size:number

  static #minSize:number = 10
  static #maxSize:number = 500

  constructor() {
    this.#buffer = []
    this.#size = 100
  }

  /**
   * Read the script buffer
   * @returns The entire buffer formatted as a single string
   */
  read():string {
    let resStr = ''
    this.#buffer.forEach(str => resStr += `${str}\n`)
    return resStr
  }

  /**
   * Write to the script buffer
   * @param data Data to write
   */
  write(data:string):void {
    this.#buffer.push(data)
    this.#trim()
  }

  //  Trim the buffer to max size
  #trim():void {
    if(this.#buffer.length > this.#size)
      this.#buffer = this.#buffer.slice(-this.#size)
  }

  /** Get the max buffer size */
  get size():number { return this.#size }

  /** Set the max buffer size and trim if necessary */
  set size(val:number) {
    if(val < ScriptBuffer.#minSize) val = ScriptBuffer.#minSize
    if(val > ScriptBuffer.#maxSize) val = ScriptBuffer.#maxSize
    this.#size = val
    this.#trim()
  }
}
