/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { EventEmitter } from 'node:events'

import type { ChildProcess } from 'node:child_process'

export class ProcessManager extends EventEmitter {
  #dataBuffer:Array<ProcessManagerData>
  #processBuffer:Array<ChildProcess>

  /** Create a new ProcessManager object */
  constructor() {
    super()
    this.#dataBuffer = []
    this.#processBuffer = []

    //  Listen for write events
    this.on('process-manager-add', (data, proc) => {
      this.#dataBuffer.push(data)
      this.#processBuffer.push(proc)
      this.emit('process-manager-updated')
    })

    //  Listen for remove events
    this.on('process-manager-remove', (pid) => {
      this.#dataBuffer = this.#dataBuffer.filter(proc => { proc.pid !== pid })
      this.#processBuffer = this.#processBuffer.filter(proc => { proc.pid !== pid })
      this.emit('process-manager-updated')
    })
  }

  /**
   * Read the ProcessManager buffer
   * @returns The list of running processes
   */
  read():Array<ProcessManagerData> {
    return this.#dataBuffer
  }

  /**
   * Terminate a running process by its Process ID
   * @param pid Process ID to terminate
   */
  term(pid:number):void {
    this.#processBuffer.forEach(proc => {
      if (proc.pid === pid) proc.kill()
    })
  }
}
