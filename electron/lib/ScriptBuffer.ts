/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import fs from 'node:fs'
import { EventEmitter } from 'node:events'

import storage from 'electron-json-storage'

/** Script Buffer save data format */
interface ScriptBufferSaveData {
  buffer:Array<ScriptBufferData>
}

export class ScriptBuffer extends EventEmitter {
  static #buffer:Array<ScriptBufferData>
  static #size:number

  static #minSize:ScriptBufferMin = 10
  static #maxSize:ScriptBufferMax = 500

  /**
   * Create a new ScriptBuffer object
   * @param load Load data or not
   * @param size Size of the buffer
   * @throws Error on load
   */
  constructor(load:boolean, size = 100) {
    super()
    ScriptBuffer.#buffer = []
    ScriptBuffer.#size = this.#check(size)

    if (load) {
      try {
        this.load()
      } catch (error:any) {
        throw error
      }
      this.#trim()
    }

    //  Listen for write events
    this.on('script-buffer-write', (data) => {
      try {
        this.#write(data)
      } catch (error:any) {
        throw error
      }
    })

    //  Listen for clear events
    this.on('script-buffer-clear', () => {
      ScriptBuffer.#buffer = []
      try {
        this.#save()
      } catch (error:any) {
        throw error
      }
      this.emit('script-buffer-updated')
    })
  }

  /**
   * Read the script buffer
   * @returns The entire buffer
   */
  read():Array<ScriptBufferData> {
    return ScriptBuffer.#buffer
  }

  /**
   * Load previous buffer from storage
   * @throws Error on load
   */
  load():void {
    try {
      storage.has('script-buffer', (error, hasKey) => {
        if (error) throw error
        if (hasKey) {
          const temp = <ScriptBufferSaveData>storage.getSync('script-buffer')
          if (temp.hasOwnProperty('buffer')) ScriptBuffer.#buffer = temp.buffer
        }
      })
    } catch (error:any) { throw new ScriptBufferError(error.message, this.load) }
  }

  /**
   * Save the buffer as a JSON file
   * @param filePath Save location
   * @throws Error when trying to write the file
   */
  saveJSON(filePath:string, encoding:string):void {
    try {
      fs.writeFileSync(filePath,
        JSON.stringify(ScriptBuffer.#buffer, null, 2), {
          encoding: <BufferEncoding>encoding })
    } catch (error:any) {
      throw new ScriptBufferError(error.message, this.saveJSON)
    }
  }

  /**
   * Save the buffer as a Log (txt) file
   * @param filePath Save location
   * @throws Error when trying to write the file
   */
  saveLog(filePath:string, encoding:string):void {
    let data = ''
    ScriptBuffer.#buffer.forEach((item, idx) => {
      data += `Command:  ${item.command}\n`
      data += `Start:  ${item.start}\n`
      data += `Stop:  ${item.stop}\n`
      data += `Duration:  ${item.duration} ms\n\n`
      data += `Stdout:\n${item.out}\n\n`
      data += `Stderr:\n${item.err}\n`
      if (idx < (ScriptBuffer.#buffer.length - 1))
        data += `\n${'-'.repeat(20)}\n\n`
    })
    try {
      fs.writeFileSync(filePath, data, {
        encoding: <BufferEncoding>encoding })
    } catch (error:any) {
      throw new ScriptBufferError(error.message, this.saveLog)
    }
  }

  /**
   * Save buffer to storage
   * @throws Error on save
   */
  #save():void {
    try {
      storage.set('script-buffer', { 'buffer': ScriptBuffer.#buffer }, (error) => {
        if (error) throw error
      })
    } catch (error:any) { throw new ScriptBufferError(error.message, this.#save) }
  }

  /**
   * Write to the script buffer and save to storage
   * @param data Data to write
   * @throws Error on save
   */
  #write(data:ScriptBufferData):void {
    ScriptBuffer.#buffer.push(data)
    this.#trim()
    try {
      this.#save()
    } catch (error:any) {
      throw new ScriptBufferError(error.message, this.#write)
    }
    this.emit('script-buffer-updated')
  }

  /** Trim the buffer to max size */
  #trim():void {
    if (ScriptBuffer.#buffer.length > ScriptBuffer.#size)
      ScriptBuffer.#buffer = ScriptBuffer.#buffer.slice(-ScriptBuffer.#size)
  }

  /**
   * Check for valid buffer size
   * @param val Value to check
   * @returns Value adjusted if above max or below min
   */
  #check(val:number) {
    if (val < ScriptBuffer.#minSize) val = ScriptBuffer.#minSize
    if (val > ScriptBuffer.#maxSize) val = ScriptBuffer.#maxSize
    return val
  }

  /** Get the max buffer size */
  get size():number { return ScriptBuffer.#size }

  /** Set the max buffer size and trim if necessary */
  set size(newSize:number) {
    ScriptBuffer.#size = this.#check(newSize)
    this.#trim()
  }
}

/**
 * Class for handling Script Buffer errors
 * @extends Error
 */
class ScriptBufferError extends Error {
  message:string
  code:Object
  exitCode:number

  /**
   * Constructs the ScriptBufferError class
   * @param message Error message
   * @param code Error code
   * @param exitCode Exit code
   */
  constructor(message:string, code:Object, exitCode?:number) {
    super()

    this.name = this.constructor.name
    this.message = message
    this.code = code
    this.exitCode = exitCode || 1

    this.stack = new Error().stack
  }
}
