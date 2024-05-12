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
  #maxSize:number

  constructor() {
    this.#buffer = []
    this.#maxSize = 100
  }

  /**
   * Read the script buffer
   * @returns The entire buffer formatted as a single string
   */
  read():string {
    let resStr = ''
    this.#buffer.forEach(str => resStr += `${str}\n\n`)
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
    if(this.#buffer.length > this.#maxSize)
      this.#buffer = this.#buffer.slice(-this.#maxSize)
  }

  /** Get the max buffer size */
  get size():number { return this.#maxSize }

  /**
   * Set the max buffer size and trim if necessary
   * Minimum size: 10 - Maximum size: 500
   */
  set size(val:number) {
    if(val < 10) val = 10
    if(val > 500) val = 500
    this.#maxSize = val
    this.#trim()
  }
}
