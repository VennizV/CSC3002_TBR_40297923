const mysql = require('mysql2');
const cron = require('node-cron');

class BubbleServices {
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
    Get Time Bubble Status by userId
    Returns 1 for active, 0 for inactive.

    @param {number} userId - The ID of the user.
    @returns {Promise<number>} - A promise that resolves to the time bubble status.
    */
    getTimeBubbleStatus(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT timeBubbleStatus FROM User WHERE user_id = ?';
            this.db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching time bubble status:', err.message);
                    return reject(err);
                }
                if (results.length > 0) {
                    resolve(results[0].timeBubbleStatus);
                } else {
                    reject(new Error('User not found'));
                }
            });
        });
    }

    /*
    Get Time Bubble Count by userId
    Returns the number of time bubbles available for the user.

    @param {number} userId - The ID of the user.
    @returns {Promise<number>} - A promise that resolves to the time bubble count.
    */
    getTimeBubbleCount(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT timeBubbleCount FROM User WHERE user_id = ?';
            this.db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching time bubble count:', err.message);
                    return reject(err);
                }
                if (results.length > 0) {
                    resolve(results[0].timeBubbleCount);
                } else {
                    reject(new Error('User not found'));
                }
            });
        });
    }

    /*
    Update Time Bubble Status by userId
    Sets the time bubble status and count for the user.

    @param {number} userId - The ID of the user.
    @param {boolean} status - The new time bubble status (true for active, false for inactive).
    @param {number} count - The new time bubble count (default is 0).
    @returns {Promise<{status: number, count: number}>} - A promise that resolves to the updated status and count.
    */
    updateTimeBubbleStatus(userId, status, count = 0) {
        return new Promise((resolve, reject) => {
            const statusValue = status ? 1 : 0;
            const query = 'UPDATE User SET timeBubbleStatus = ?, timeBubbleCount = ? WHERE user_id = ?';
            this.db.query(query, [statusValue, count, userId], (err) => {
                if (err) {
                    console.error('Error updating time bubble status:', err.message);
                    return reject(err);
                }
                resolve({ status: statusValue, count });
            });
        });
    }

    /*
    Increment Time Bubble Count by userId
    Increments the time bubble count for how many times the user clicks the button.
    This is used when the user wants to add to their time bubble.

    @param {number} userId - The ID of the user.
    @returns {Promise<void>} - A promise that resolves when the count is incremented.
    */
    incrementTimeBubbleCount(userId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE User SET timeBubbleCount = timeBubbleCount + 1 WHERE user_id = ?';
            this.db.query(query, [userId], (err) => {
                if (err) {
                    console.error('Error incrementing time bubble count:', err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /*
    Decrement Time Bubble Count by userId
    Decrements the time bubble count for how many times the user clicks the button.
    This is used when the user wants to remove from their time bubble.
    It only decrements if the count is greater than 0 and the bubble is active.

    @param {number} userId - The ID of the user.
    @returns {Promise<void>} - A promise that resolves when the count is decremented.
    @throws {Error} - If the bubble is off or the count is already zero.
    @throws {Error} - If the user is not found.
    */
    decrementTimeBubbleCount(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE User 
                SET timeBubbleCount = timeBubbleCount - 1 
                WHERE user_id = ? AND timeBubbleCount > 0 AND timeBubbleStatus = 1
            `;
            this.db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error decrementing time bubble count:', err.message);
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('Cannot decrement count. Either bubble is off or count is already zero.'));
                }
                resolve();
            });
        });
    }

    /*
    Get All Users with Active Bubbles
    Returns an array of users who have active time bubbles.
    This is used for the cron job to decrement daily time bubbles.
    */
    async getAllUsersWithActiveBubbles() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user_id, timeBubbleCount, timeBubbleStatus FROM User WHERE timeBubbleStatus = 1';
            this.db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching users with active bubbles:', err.message);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    /*
    Decrement Daily Time Bubble Count
    This function is scheduled to run daily at midnight using cron.
    */
    decrementDailyTimeBubble() {
        cron.schedule('0 0 * * *', async () => {
            console.log(`[${new Date().toISOString()}] Running bubble decrement job...`);

            try {
                const users = await this.getAllUsersWithActiveBubbles();

                for (const user of users) {
                    if (user.timeBubbleCount > 0 && user.timeBubbleStatus === 1) {
                        await this.decrementTimeBubbleCount(user.user_id);
                    }
                }
            } catch (error) {
                console.error(`[${new Date().toISOString()}] Error in bubble decrement job:`, error.message);
            }
        });

        console.log('Bubble decrement job scheduled to run daily at midnight.');
    }
}

module.exports = BubbleServices;