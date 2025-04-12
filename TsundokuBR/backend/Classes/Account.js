/*
Account Class Constructor
@param {string} accountID - Unique identifier for the account
@param {string} username - Username associated with the account
@param {string} password - Password associated with the account
*/
class Account {
    constructor(accountID, username, password) {
      this.accountID = accountID;
      this.username = username;
      this.password = password;
    }
  
    /* Method to convert data from the database to Account object
    @param {object} data - Data from the database
    @returns {Account} - Account object created from database data
    */
    static fromData(data) {
      return new Account(data.account_id, data.username, data.password);
    }
  }
  
  module.exports = Account;
  