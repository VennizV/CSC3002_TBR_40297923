const mysql = require('mysql2');
const Levels = require('../Classes/Levels');

class UserServices {
    constructor() {
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
    Fetch Reading Level Status by userId
    This method retrieves the reading level status of a user based on their userId.

    @param {number} userId - The ID of the user whose reading level status is to be fetched.
    @returns {Promise<string>} - A promise that resolves to the reading level status of the user.
    */
    getReadingLevelStatus(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT readingLevel FROM User WHERE user_id = ?';
            this.db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching reading level:', err.message);
                    return reject(err);
                }
                if (results.length > 0) {
                    resolve(results[0].readingLevel);
                } else {
                    reject(new Error('User not found'));
                }
            });
        });
    }

    /*
    Update Reading Level Status by userId
    This method updates the reading level status of a user based on their userId.

    @param {number} userId - The ID of the user whose reading level status is to be updated.
    @param {string} newLevel - The new reading level status to be set for the user.
    @returns {Promise<string>} - A promise that resolves to the updated reading level status of the user.
    */
    updateReadingLevelStatus(userId, newLevel) {
        return new Promise((resolve, reject) => {
            if (![Levels.LIGHT, Levels.MODERATE, Levels.HEAVY].includes(newLevel)) {
                return reject(new Error('Invalid reading level'));
            }

            const query = 'UPDATE User SET readingLevel = ? WHERE user_id = ?';
            this.db.query(query, [newLevel, userId], (err, results) => {
                if (err) {
                    console.error('Error updating reading level:', err.message);
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('User not found'));
                }
                resolve(newLevel);
            });
        });
    }
}

module.exports = UserServices;