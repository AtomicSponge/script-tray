/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

/** Wrapper to Promise class to access functions */
export class Resolver {
  promise:Promise<any>
  reject:Function = () => {}
  resolve:Function = () => {}
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}
