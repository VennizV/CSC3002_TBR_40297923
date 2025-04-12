/*
 Bubble Class Constructor
 @param {string} status - Status of the time bubble feature ('on' or 'off')
 @param {number} count - Length of days left for the user to read their book
 @param {Date} lastDecrementDate - Date when the bubble count was last decremented
*/
class Bubble {
    constructor(status, count) {
        this.status = status;
        this.count = count;
        this.lastDecrementDate = new Date();
    }
}

module.exports = Bubble;
