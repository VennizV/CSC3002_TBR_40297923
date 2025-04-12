const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const BookServices = require('../../Services/BookServices');

    /*
    Test Suite for BookServices Class
    - addBookToUser: Adds a book to a user's TBR list and updates the TBR count.
    - handleSetAsCurrentRead: Sets a book as the current read for a user and updates the current read count.
    - deleteBookFromUser: Deletes a book from a user's TBR list and updates the TBR count.
    - moveToReadShelf: Moves a book from the TBR list to the read shelf and updates the counts.
    */
describe('BookServices Class', () => {
    let bookServices;
    let mockDb;

    beforeEach(() => {
        // Mock MySQL connection
        mockDb = {
            query: sinon.stub(),
            connect: sinon.stub(),
        };
        sinon.stub(require('mysql2'), 'createConnection').returns(mockDb);
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');

        bookServices = new BookServices();
    });

    afterEach(() => {
        sinon.restore();
    });

describe('addBookToUser', () => {
    it('addBookToUser_ValidUserIdAndValidBookData_Success', async () => {
        const userId = 1;
        const bookData = {
            bookID: 'book123',
            title: 'Valid Book Title',
            authors: [{ name: 'Author One' }, { name: 'Author Two' }],
            description: 'Valid description.',
            cover: 'cover.jpg',
            publishedDate: '2022-01-01',
        };

        mockDb.query
            .onFirstCall().callsArgWith(2, null)
            .onSecondCall().callsArgWith(2, null)
            .onThirdCall().callsArgWith(2, null);

        const result = await bookServices.addBookToUser(userId, bookData);

        expect(result).to.deep.equal({ success: true, message: 'Book added to TBR and TBR count updated' });
        expect(mockDb.query.callCount).to.equal(3);
    });

    it('addBookToUser_InvalidUserIdAndInvalidBookData_Failure', async () => {
        const userId = null;
        const bookData = {
            bookID: null,
            title: null,
            authors: [],
            description: null,
            cover: null,
            publishedDate: null,
        };

        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid book data'));

        try {
            await bookServices.addBookToUser(userId, bookData);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Invalid book data');
        }

        expect(mockDb.query.callCount).to.equal(1);
    });

    it('addBookToUser_ValidUserIdAndInvalidBookData_Failure', async () => {
        const userId = 1;
        const bookData = {
            bookID: null,
            title: null,
            authors: [],
            description: null,
            cover: null,
            publishedDate: null,
        };

        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid book data'));

        try {
            await bookServices.addBookToUser(userId, bookData);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Invalid book data');
        }

        expect(mockDb.query.callCount).to.equal(1);
    });

    it('addBookToUser_InvalidUserIdAndValidBookData_Failure', async () => {
        const userId = null;
        const bookData = {
            bookID: 'book123',
            title: 'Valid Book Title',
            authors: [{ name: 'Author One' }, { name: 'Author Two' }],
            description: 'Valid description.',
            cover: 'cover.jpg',
            publishedDate: '2022-01-01',
        };

        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID'));

        try {
            await bookServices.addBookToUser(userId, bookData);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Invalid user ID');
        }

        expect(mockDb.query.callCount).to.equal(1);
    });
});

describe('handleSetAsCurrentRead', () => {
    it('handleSetAsCurrentRead_ValidUserIdAndValidBookId_Success', async () => {
        const userId = 1;
        const bookId = 'book123';
    
        mockDb.query
            .onFirstCall().callsArgWith(2, null)
            .onSecondCall().callsArgWith(2, null);
    
        const result = await bookServices.handleSetAsCurrentRead(userId, bookId);
    
        expect(result).to.deep.equal({ success: true, message: 'Book set as Current Read successfully.' });
        expect(mockDb.query.callCount).to.equal(2);
    });
    
    it('handleSetAsCurrentRead_InvalidUserIdAndInvalidBookId_Failure', async () => {
        const userId = null;
        const bookId = null;
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID or book ID'));
    
        try {
            await bookServices.handleSetAsCurrentRead(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to reset current reads.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
    
    it('handleSetAsCurrentRead_ValidUserIdAndInvalidBookId_Failure', async () =>{
    
        const userId = 1;
        const bookId = null;
    
        mockDb.query
        .onFirstCall().callsArgWith(2, null)
        .onSecondCall().callsArgWith(2, new Error('Invalid book ID'));
    
        try {
            await bookServices.handleSetAsCurrentRead(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to set book as current read.');
        }
    
        expect(mockDb.query.callCount).to.equal(2);
    });
    
    it('handleSetAsCurrentRead_InvalidUserIdAndValidBookId_Failure', async () => {
        const userId = null;
        const bookId = 'book123';
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID'));
    
        try {
            await bookServices.handleSetAsCurrentRead(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to reset current reads.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
});

describe('deleteBookFromUser', () => {
    it('deleteBookFromUser_ValidUserIdAndValidBookId_Success', async () => {
        const userId = 1;
        const bookId = 'book123';
    
        mockDb.query
            .onFirstCall().callsArgWith(2, null)
            .onSecondCall().callsArgWith(2, null);
    
        const result = await bookServices.deleteBookFromUser(userId, bookId);
    
        expect(result).to.deep.equal({ success: true, message: 'Book deleted from user and TBR count updated.' });
        expect(mockDb.query.callCount).to.equal(2);
    });
    
    it('deleteBookFromUser_InvalidUserIdAndInvalidBookId_Failure', async () => {
        const userId = null;
        const bookId = null;
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID or book ID'));
    
        try {
            await bookServices.deleteBookFromUser(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to delete book from user.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
    
    it('deleteBookFromUser_ValidUserIdAndInvalidBookId_Failure', async () => {
        const userId = 1;
        const bookId = null;
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid book ID'));
    
        try {
            await bookServices.deleteBookFromUser(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to delete book from user.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
    
    it('deleteBookFromUser_InvalidUserIdAndValidBookId_Failure', async () => {
        const userId = null;
        const bookId = 'book123';
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID'));
    
        try {
            await bookServices.deleteBookFromUser(userId, bookId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to delete book from user.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
});

describe('moveToReadShelf', () => {
    it('moveToReadShelf_ValidUserIdAndValidBookCover_Success', async () => {
        const userId = 1;
        const bookCover = 'cover.jpg';
    
        mockDb.query
            .onFirstCall().callsArgWith(2, null, [{ book_id: 'book123' }])
            .onSecondCall().callsArgWith(2, null)
            .onThirdCall().callsArgWith(2, null);
    
        const result = await bookServices.moveToReadShelf(userId, bookCover);
    
        expect(result).to.deep.equal({ success: true, message: 'Book moved to Read Shelf and counts updated.' });
        expect(mockDb.query.callCount).to.equal(3);
    });
    
    it('moveToReadShelf_InvalidUserIdAndInvalidBookCover_Failure', async () => {
        const userId = null;
        const bookCover = null;
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid book cover or user ID'));
    
        try {
            await bookServices.moveToReadShelf(userId, bookCover);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to fetch book ID or book not found.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
    
    it('moveToReadShelf_ValidUserIdAndInvalidBookCover_Failure', async () => {
        const userId = 1;
        const bookCover = 'invalid-cover.jpg';
    
        mockDb.query.onFirstCall().callsArgWith(2, null, []);
    
        try {
            await bookServices.moveToReadShelf(userId, bookCover);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to fetch book ID or book not found.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
    
    it('moveToReadShelf_InvalidUserIdAndValidBookCover_Failure', async () => {
        const userId = null;
        const bookCover = 'cover.jpg';
    
        mockDb.query.onFirstCall().callsArgWith(2, new Error('Invalid user ID'));
    
        try {
            await bookServices.moveToReadShelf(userId, bookCover);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Failed to fetch book ID or book not found.');
        }
    
        expect(mockDb.query.callCount).to.equal(1);
    });
});
});