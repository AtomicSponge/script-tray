/**
 * Format a date object as YYYY-MM-DD-HH:MM:SS
 * Adapted from:
 * https://github.com/bobbyhadz/javascript-format-date-yyyy-mm-dd-hh-mm-ss
 * @param date Date object to format
 * @returns Formatted date as a string
 */
export const formatDate = (date:Date):string => {
  /**
   * Pad a number to two digits
   * @param num Number to pad
   * @returns Modified string
   */
  const padToTwoDigits = (num:number):string => {
    return num.toString().padStart(2, '0')
  }
  return (
    [
      date.getFullYear(),
      padToTwoDigits(date.getMonth() + 1),
      padToTwoDigits(date.getDate()),
    ].join('-') +
    '-' +
    [
      padToTwoDigits(date.getHours()),
      padToTwoDigits(date.getMinutes()),
      padToTwoDigits(date.getSeconds()),
    ].join(':')
  )
}
