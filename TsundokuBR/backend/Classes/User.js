const Levels = require('./Levels');
const Account = require('./Account');

/*
 User Class Constructor
 @param {string} id - Unique identifier for the user
 @param {Account} account - Account object associated with the user
 @param {Levels} readingLevel - Reading level of the user
 @param {string} timeBubbleStatus - Status of the time bubble feature ('on' or 'off')
 @param {number} timeBubbleCount - Length of days left for the user to read their book
 @param {number} totalTBR - Total books within the TBR shelf
 @param {number} totalRead - Total books within the Read shelf
 */
class User {
    constructor(id, account, readingLevel, timeBubbleStatus = 'off', timeBubbleCount = 0, totalTBR = 0, totalRead = 0) {
        this.id = id;
        this.account = account;
        this.readingLevel = readingLevel;
        this.timeBubbleStatus = timeBubbleStatus;
        this.timeBubbleCount = timeBubbleCount;
        this.totalTBR = totalTBR;
        this.totalRead = totalRead;
    }
}

module.exports = User;