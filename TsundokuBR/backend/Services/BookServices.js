const mysql = require('mysql2');

class BookServices {
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
        Adds a book to the user's TBR (To Be Read) list and updates the TBR count.
        The book's details are inserted into the 'book' table, and a link is created in the 'user_book' table.
        The TBR count for the user is also incremented.
    
        @param {number} userId - The ID of the user to whom the book is being added.
        @param {object} bookData - An object containing the book's details.
            - bookID: The ID of the book.
            - title: The title of the book.
            - authors: An array of authors of the book.
            - description: A description of the book.
            - cover: The cover image URL of the book.
            - publishedDate: The publication date of the book.
    
        @returns {Promise<object>} A promise that resolves with a success message or rejects with an error message.
    */
    addBookToUser(userId, bookData) {
        return new Promise((resolve, reject) => {
            const bookQuery = `
                INSERT INTO book (book_id, title, author, description, cover, publishDate)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE title = title; -- Avoid duplicates`;
    
            const formattedDate = bookData.publishedDate
                ? bookData.publishedDate.length === 4 // If only the year is provided
                    ? `${bookData.publishedDate}-01-01` // Format as YYYY-01-01
                    : bookData.publishedDate.length === 7 // If year and month are provided
                    ? `${bookData.publishedDate}-01` // Format as YYYY-MM-01
                    : bookData.publishedDate // Use the full date (YYYY-MM-DD) if available
                : null; // Set to null if no date is provided
    
            const bookValues = [
                bookData.bookID,
                bookData.title || '',
                bookData.authors.map(author => author.name).join(', '),
                bookData.description || null,
                bookData.cover || '',
                formattedDate
            ];
    
            this.db.query(bookQuery, bookValues, (bookErr) => {
                if (bookErr) {
                    console.error('Error inserting book:', bookErr.message);
                    return reject(bookErr);
                }
    
                const userBookQuery = `
                    INSERT INTO user_book (user_id, book_id) VALUES (?, ?);
                `;
    
                this.db.query(userBookQuery, [userId, bookData.bookID], (userBookErr) => {
                    if (userBookErr) {
                        console.error('Error linking book to user:', userBookErr.message);
                        return reject(userBookErr);
                    }
    
                    const updateTBRQuery = `
                        UPDATE user SET total_InTBR = total_InTBR + 1 WHERE user_id = ?;
                    `;
    
                    this.db.query(updateTBRQuery, [userId], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating TBR count:', updateErr.message);
                            return reject(updateErr);
                        }
    
                        resolve({ success: true, message: 'Book added to TBR and TBR count updated' });
                    });
                });
            });
        });
    }

    /*
        Sets a book as the current read for the user by resetting all other current reads to 0 and updating the specified book to 1.
    
        @param {number} userId - The ID of the user.
        @param {number} bookId - The ID of the book to be set as current read.
    */
    handleSetAsCurrentRead(userId, bookId) {
        return new Promise((resolve, reject) => {
            const resetCurrentReadQuery = `
                UPDATE user_book
                SET current_read = 0
                WHERE user_id = ?;
            `;
    
            this.db.query(resetCurrentReadQuery, [userId], (resetErr) => {
                if (resetErr) {
                    console.error('Error resetting current reads:', resetErr.message);
                    return reject(new Error('Failed to reset current reads.'));
                }
                const setCurrentReadQuery = `
                    UPDATE user_book
                    SET current_read = 1
                    WHERE user_id = ? AND book_id = ?;
                `;
    
                this.db.query(setCurrentReadQuery, [userId, bookId], (setErr) => {
                    if (setErr) {
                        console.error('Error setting current read:', setErr.message);
                        return reject(new Error('Failed to set book as current read.'));
                    }
    
                    resolve({ success: true, message: 'Book set as Current Read successfully.' });
                });
            });
        });
    }

    /*
        Deletes a book from the user's TBR list and decrements the TBR count.
        The book is removed from the 'user_book' table, and the TBR count for the user is decremented.
    
        @param {number} userId - The ID of the user from whom the book is being deleted.
        @param {number} bookId - The ID of the book to be deleted.
    
        @returns {Promise<object>} A promise that resolves with a success message or rejects with an error message.
    */
    deleteBookFromUser(userId, bookId) {
        return new Promise((resolve, reject) => {
            const deleteUserBookQuery = `
                DELETE FROM user_book 
                WHERE user_id = ? AND book_id = ?;
            `;
    
            this.db.query(deleteUserBookQuery, [userId, bookId], (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting book from user:', deleteErr.message);
                    return reject(new Error('Failed to delete book from user.'));
                }
                
                const updateTBRCountQuery = `
                    UPDATE user 
                    SET total_InTBR = total_InTBR - 1 
                    WHERE user_id = ?;
                `;
    
                this.db.query(updateTBRCountQuery, [userId], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating TBR count:', updateErr.message);
                        return reject(new Error('Failed to update TBR count.'));
                    }
    
                    resolve({ success: true, message: 'Book deleted from user and TBR count updated.' });
                });
            });
        });
    }

    /*
        Moves a book from the TBR (To Be Read) shelf to the Read shelf for a user.
        The book's status is updated in the 'user_book' table, and the TBR and Read counts for the user are updated.

        @param {number} userId - The ID of the user moving the book.
        @param {string} bookCover - The cover image URL of the book to be moved.
    */
    moveToReadShelf(userId, bookCover) {
        return new Promise((resolve, reject) => {
            const fetchBookIdQuery = `
                SELECT book_id FROM book WHERE cover = ?;
            `;
    
            this.db.query(fetchBookIdQuery, [bookCover], (fetchErr, results) => {
                if (fetchErr || results.length === 0) {
                    console.error('Error fetching book ID:', fetchErr?.message || 'Book not found.');
                    return reject(new Error('Failed to fetch book ID or book not found.'));
                }
    
                const bookId = results[0].book_id;
    
                const updateToReadQuery = `
                    UPDATE user_book 
                    SET is_read = 1 
                    WHERE user_id = ? AND book_id = ?;
                `;
                const updateCountsQuery = `
                    UPDATE user 
                    SET total_InTBR = total_InTBR - 1, 
                        total_inRead = total_inRead + 1 
                    WHERE user_id = ?;
                `;
    
                this.db.query(updateToReadQuery, [userId, bookId], (updateErr) => {
                    if (updateErr) {
                        console.error('Error moving book to Read Shelf:', updateErr.message);
                        return reject(new Error('Failed to update book to Read Shelf.'));
                    }
    
                    this.db.query(updateCountsQuery, [userId], (countErr) => {
                        if (countErr) {
                            console.error('Error updating TBR and Read counts:', countErr.message);
                            return reject(new Error('Failed to update user counts.'));
                        }
    
                        resolve({ success: true, message: 'Book moved to Read Shelf and counts updated.' });
                    });
                });
            });
        });
    }                
}

module.exports = BookServices;