/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { EventEmitter } from 'node:events'

export class ScriptBuffer extends EventEmitter {
  #buffer:Array<ScriptBufferData>
  #size:number

  static #minSize:ScriptBufferMin = 10
  static #maxSize:ScriptBufferMax = 500

  /**
   * Create a new ScriptBuffer object
   * @param size Size of the buffer
   */
  constructor(size = 100) {
    super()
    this.#buffer = []
    this.#size = this.#check(size)

    //  Listen for write events
    this.on('script-buffer-write', (data) => {
      this.#write(data)
    })
  }

  /**
   * Read the script buffer
   * @returns The entire buffer
   */
  read():Array<ScriptBufferData> {
    return this.#buffer
  }

  /**
   * Write to the script buffer
   * @param data Data to write
   */
  #write(data:ScriptBufferData):void {
    this.#buffer.push(data)
    this.#trim()
    this.emit('script-buffer-updated')
  }

  /** Trim the buffer to max size */
  #trim():void {
    if(this.#buffer.length > this.#size)
      this.#buffer = this.#buffer.slice(-this.#size)
  }

  /**
   * Check for valid buffer size
   * @param val Value to check
   * @returns Value adjusted if above max or below min
   */
  #check(val:number) {
    if(val < ScriptBuffer.#minSize) val = ScriptBuffer.#minSize
    if(val > ScriptBuffer.#maxSize) val = ScriptBuffer.#maxSize
    return val
  }

  /** Get the max buffer size */
  get size():number { return this.#size }

  /** Set the max buffer size and trim if necessary */
  set size(newSize:number) {
    this.#size = this.#check(newSize)
    this.#trim()
  }
}
