/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

/**
 * Class for handling Script Tray errors
 * @extends Error
 */
export class TrayError extends Error {
  message:string
  code:Object
  exitCode:number

  /**
   * Constructs the TrayError class
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