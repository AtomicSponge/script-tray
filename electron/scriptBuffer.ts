/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

interface IscriptBuffer {
  readonly data: {
    buffer:Array<string>
    maxSize:number
  }
  read():string
  write(data:string):void
  get size():number
  set size(val:number)
}

export const scriptBuffer:IscriptBuffer = {
  data: {
    buffer: [],
    maxSize: 100
  },

  /**
   * Read the script buffer
   * @returns The entire buffer formatted as a single string
   */
  read():string {
    let resStr = ''
    scriptBuffer.data.buffer.forEach(str => resStr += `${str}\n\n`)
    return resStr
  },

  /**
   * Write to the script buffer
   * @param data Data to write
   */
  write(data:string):void {
    scriptBuffer.data.buffer.push(data)
    if(scriptBuffer.data.buffer.length > scriptBuffer.data.maxSize)
      scriptBuffer.data.buffer = scriptBuffer.data.buffer.slice(-scriptBuffer.data.maxSize)
  },

  /** Get the max buffer size */
  get size():number { return scriptBuffer.data.maxSize },
  /** Set the max buffer size */
  set size(val:number) { scriptBuffer.data.maxSize = val }
}
