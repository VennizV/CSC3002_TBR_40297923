const mysql = require('mysql2');
const User = require('../Classes/User');
const Levels = require('../Classes/Levels');

class AccountServices {
    constructor() {
        this.users = [];
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'tsundokubr40297923!',
            database: 'tsundokubr'
        });

        this.db.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL:', err.message);
                return;
            }
            console.log('Connected to MySQL database.');
        });
    }

    /*
        Creates a new account and user in the database.
        The account is created first, and then the user is created with a default reading level and time bubble status.

        @param {string} username - The username for the new account.
        @param {string} password - The password for the new account.
        
        @throws {Error} - If there is an error during account creation or insertion into the database.
        @returns {Promise<User>} - A promise that resolves to the created User object.
    */
    createAccount(username, password) {
        return new Promise((resolve, reject) => {
            console.log('Attempting to create account with username:', username);
            const accountQuery = 'INSERT INTO Account (username, password) VALUES (?, ?)';
            const userQuery = 'INSERT INTO User (account_id, readingLevel, timeBubbleStatus, timeBubbleCount, total_InTBR, total_inRead) VALUES (?, ?, ?, ?, ?, ?)';

            this.db.query(accountQuery, [username, password], (err, accountResult) => {
                if (err) {
                    console.error('Error inserting into Account:', err.message);
                    return reject(err);
                }
                const accountID = accountResult.insertId;
                const readingLevel = Levels.MODERATE;
                const timeBubbleStatus = false;
                const timeBubbleCount = 0;
                const total_InTBR = 0;
                const total_inRead = 0;

                const user = new User(this.users.length + 1, accountID, readingLevel, timeBubbleStatus, timeBubbleCount, total_InTBR, total_inRead);

                this.db.query(userQuery, [accountID, readingLevel, timeBubbleStatus, timeBubbleCount, total_InTBR, total_inRead], (err, userResult) => {
                    if (err) {
                        console.error('Error inserting into User:', err.message);
                        return reject(err);
                    }
                    this.users.push(user);
                    resolve(user);
                });
            });
        });
    }

    /*
        Logs in a user by checking the provided username and password against the database.
        If the credentials are valid, it retrieves the corresponding user information.

        @param {string} username - The username of the account to log in.  
        @param {string} password - The password of the account to log in.

        @throws {Error} - If there is an error during login or if the credentials are invalid.
        @throws {Error} - If the user is not found or if the credentials are invalid.
        @returns {Promise<User>} - A promise that resolves to the User object if login is successful.
    */
    login(username, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Account WHERE username = ? AND password = ?';
            this.db.query(query, [username, password], (err, results) => {
                if (err) {
                    console.error('Error querying database:', err.message);
                    return reject(err);
                }

                if (results.length > 0) {
                    const account = results[0];
                    const userQuery = 'SELECT * FROM User WHERE account_id = ?';
                    this.db.query(userQuery, [account.account_id], (err, userResults) => {
                        if (err) {
                            console.error('Error querying database:', err.message);
                            return reject(err);
                        }

                        if (userResults.length > 0) {
                            const user = userResults[0];
                            const userInstance = new User(
                                user.user_id,
                                account,
                                user.readingLevel,
                                user.timeBubbleStatus,
                                user.timeBubbleCount,
                                user.total_InTBR,
                                user.total_inRead
                            );
                            resolve(userInstance);
                        } else {
                            reject(new Error('User not found.'));
                        }
                    });
                } else {
                    reject(new Error('Invalid username or password.'));
                }
            });
        });
    }
}

module.exports = AccountServices;
