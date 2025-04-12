const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { searchBooksByTitle, searchBooksByAuthor } = require('./Services/FetchBook');
const BookServices = require('./Services/BookServices');
const AccountServices = require('./Services/AccountServices');
const UserServices = require('./Services/UserServices');
const BubbleServices = require('./Services/BubbleServices');
const Levels = require('./Classes/Levels');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tsundokubr40297923!',
    database: 'tsundokubr'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const accountServices = new AccountServices();
const bookServices = new BookServices();
const userService = new UserServices();
const bubbleService = new BubbleServices();

/*
endpoint to create a new account
- POST /create-account
- Request body should contain username and password
- Returns a success message and the created user object if successful
*/
app.post('/create-account', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const newUser = await accountServices.createAccount(username, password);
        res.status(200).json({ message: 'Account created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating account:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/*
endpoint to log in to an existing account
- POST /login
- Request body should contain username and password
- Returns a success message and the logged-in user object if successful
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await accountServices.login(username, password);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(401).json({ error: error.message });
    }
});

/*
endpoint to fetch user reading level information
- GET /level
- request query should contain userId
- Returns the user's reading level information if successful
*/
app.get('/level', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const level = await userService.getReadingLevelStatus(userId);
        res.status(200).json({ readingLevel: level });
    } catch (error) {
        console.error("Error getting reading level status:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/*
endpoint to update user reading level information
- POST /level
- Request body should contain userId and readingLevel
- Returns a success message and the updated reading level if successful
*/
app.post('/level', async (req, res) => {
    console.log(req.body);
    const { userId, readingLevel } = req.body;

    if (!userId || !readingLevel) {
        return res.status(400).json({ error: 'User ID and reading level are required.' });
    }

    try {
        const updatedLevel = await userService.updateReadingLevelStatus(userId, readingLevel);
        res.status(200).json({ message: 'Reading level updated successfully', readingLevel: updatedLevel });
    } catch (error) {
        console.error('Error in POST /level:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/*
endpoint to fetch book data by the title
- GET /title
- request query should contain title
- Returns the book data if successful
*/
app.get('/title', async (req, res) => {
    const { title } = req.query;
    try {
        const books = await searchBooksByTitle(title);
        res.json(books);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*
endpoint to fetch book data by the author
- GET /author
- request query should contain author
- Returns the book data if successful
*/
app.get('/author', async (req, res) => {
    const { author } = req.query;
    try {
        const books = await searchBooksByAuthor(author);
        res.json(books);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*
endpoint to fetch all books from the database
- GET /api/books
- Returns all books successfully found in the google books API
- Returns an error message if there was an issue fetching the books
*/
app.get('/api/books', async (req, res) => {
    try {
        const books = await bookServices.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ error: 'Failed to fetch books from the database.' });
    }
});

/*
endpoint to add a book to the user's TBR list
- POST /api/addBookToTBR
- Request body should contain userId and bookData to be added
- Returns a success message and the updated TBR list if successful and the TBR count is incremented
- Returns an error message if there was an issue adding the book
*/
app.post('/api/addBookToTBR', async (req, res) => {
    const { userId, bookData } = req.body;

    if (!userId || !bookData) {
        return res.status(400).json({ success: false, message: 'Missing userId or bookData' });
    }

    try {
        const result = await bookServices.addBookToUser(userId, bookData);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in /api/addBookToTBR:', error.message);
        res.status(500).json({ success: false, message: 'Failed to add book to TBR.' });
    }
});

/*
endpoint to fetch the user's TBR status and count
- GET /bubble
- request query should contain userId
- Returns the user's bubble status and count if successful
- Returns an error message if there was an issue fetching the bubble status
*/
app.get('/bubble', async (req, res) => {
    console.log(req.query);
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const status = await bubbleService.getTimeBubbleStatus(userId);
        const count = await bubbleService.getTimeBubbleCount(userId);
        res.status(200).json({ status, count });
    } catch (error) {
        console.error('Error in GET /bubble:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/*
endpoint to update the user's bubble status and count
- POST /bubble
- Request body should contain userId, status (boolean), and count
- Returns a success message and the updated bubble status and count if successful
- Returns an error message if there was an issue updating the bubble status
*/
app.post('/bubble', async (req, res) => {
    const { userId, status, count } = req.body;

    if (!userId || status === undefined) {
        return res.status(400).json({ error: 'User ID and status are required.' });
    }

    try {
        await bubbleService.updateTimeBubbleStatus(userId, !!status, count || 0);
        res.status(200).json({ message: 'Bubble state updated successfully', status, count });
    } catch (error) {
        console.error('Error in POST /bubble:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/*
endpoint to increment the user's bubble count
- POST /bubble/increment
- Request body should contain userId
- Returns a success message and the updated bubble status and count if successful
- Returns an error message if there was an issue incrementing the bubble count
*/
app.post('/bubble/increment', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        await bubbleService.incrementTimeBubbleCount(userId); 
        const status = await bubbleService.getTimeBubbleStatus(userId);
        const count = await bubbleService.getTimeBubbleCount(userId);

        res.status(200).json({
            message: 'Bubble count incremented successfully',
            status,
            count
        });
    } catch (error) {
        console.error('Error in POST /bubble/increment:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/*
endpoint to decrement the user's bubble count
- POST /bubble/decrement
- Request body should contain userId
- Returns a success message and the updated bubble status and count if successful
- Returns an error message if there was an issue decrementing the bubble count
*/
app.post('/bubble/decrement', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const currentCount = await bubbleService.getTimeBubbleCount(userId);
        if (currentCount <= 0) {
            throw new Error('Cannot decrement: Count is already zero.');
        }

        await bubbleService.decrementTimeBubbleCount(userId);
        const updatedStatus = await bubbleService.getTimeBubbleStatus(userId);
        const updatedCount = await bubbleService.getTimeBubbleCount(userId);

        res.status(200).json({
            message: 'Bubble count decremented successfully',
            status: updatedStatus,
            count: updatedCount,
        });
    } catch (error) {
        console.error('Error in POST /bubble/decrement:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/*
endpoint to fetch the user's TBR count
- GET /tbr
- request query should contain userId
- Returns the user's TBR count if successful
- Returns an error message if there was an issue fetching the TBR count
*/
app.get('/tbr', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const query = 'SELECT total_InTBR FROM user WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching TBR count:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (results.length > 0) {
            res.status(200).json({ totalBooksInTBR: results[0].total_InTBR });
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
});

/*
endpoint to fetch the user's TBR books
- GET /tbr/books
- request query should contain userId
- Returns the user's TBR books if successful
- Returns an error message if there was an issue fetching the TBR books
- Returns an error message if the userId is not provided
*/
app.get('/tbr/books', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const query = `
        SELECT b.book_id, b.cover
        FROM book b
        JOIN user_book ub ON b.book_id = ub.book_id
        WHERE ub.user_id = ? AND ub.is_read = 0;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching TBR books:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(200).json(results);
    });
});

/*
endpoint to move a book to the read shelf
- POST /api/moveToReadShelf
- Request body should contain userId and bookCover
- Returns a success message and the updated read shelf if successful
- Returns an error message if there was an issue moving the book
- Returns an error message if the userId or bookCover is not provided
*/
app.post('/api/moveToReadShelf', async (req, res) => {
    console.log(req.body);
    const { userId, bookCover } = req.body;

    try {
        const result = await bookServices.moveToReadShelf(userId, bookCover);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in /api/moveToReadShelf:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

/*
endpoint to fetch the user's read books
- GET /read/books
- request query should contain userId
- Returns the user's read books if successful
- Returns an error message if there was an issue fetching the read books
- Returns an error message if the userId is not provided
*/
app.get('/read/books', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const query = `
        SELECT b.book_id, b.title, b.author, b.cover
        FROM book b
        JOIN user_book ub ON b.book_id = ub.book_id
        WHERE ub.user_id = ? AND ub.is_read = 1;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching read books:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(200).json(results);
    });
});

/*
endpoint to fetch the count of read books
- GET /read/count
- request query should contain userId
- Returns the count of read books if successful
- Returns an error message if there was an issue fetching the count
*/
app.get('/read/count', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const query = `
        SELECT COUNT(*) as totalBooksRead
        FROM user_book
        WHERE user_id = ? AND is_read = 1;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching read book count:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.status(200).json({ totalBooksRead: results[0].totalBooksRead });
    });
});

/*
endpoint to set a book as the current read
- POST /api/setCurrentRead
- Request body should contain userId and bookId
- Returns a success message and the updated current read book if successful
- Returns an error message if there was an issue setting the current read book
- Returns an error message if the userId or bookId is not provided
*/
app.post('/api/setCurrentRead', async (req, res) => {
    console.log(req.body);
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ error: 'User ID and Book ID are required.' });
    }

    try {
        const result = await bookServices.handleSetAsCurrentRead(userId, bookId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error setting current read:', error.message);
        res.status(500).json({ error: 'Failed to set current read.' });
    }
});

/*
endpoint to fetch the current read book
- GET /api/getCurrentRead
- request query should contain userId
- Returns the current read book if successful
- Returns an error message if there was an issue fetching the current read book
- Returns an error message if the userId is not provided
- Returns an error message if the current read book is not found
- Returns an error message if the userId is not provided
*/
app.get('/api/getCurrentRead', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const query = `
        SELECT b.book_id, b.title, b.author, b.description, b.cover
        FROM book b
        JOIN user_book ub ON b.book_id = ub.book_id
        WHERE ub.user_id = ? AND ub.current_read = 1;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching current read:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No current read found for this user.' });
        }

        res.status(200).json(results[0]);
    });
});

/*
endpoint to delete a book from the TBR list
- POST /api/deleteBookFromTBR
- Request body should contain userId and bookId
- Returns a success message and the updated TBR list if successful
- Returns an error message if there was an issue deleting the book
*/
app.post('/api/deleteBookFromTBR', async (req, res) => {
    console.log(req.body);
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ error: 'User ID and Book ID are required.' });
    }

    try {
        const result = await bookServices.deleteBookFromUser(userId, bookId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in /api/deleteBookFromTBR:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}