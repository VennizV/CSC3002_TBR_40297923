const chai = require('chai');
const expect = chai.expect;
const Book = require('../../Classes/Book.js');
const Author = require('../../Classes/Author.js');

    /*
    Test Suite for Book Class
    - Tests the constructor and its parameters
    */
describe('Book Class', () => {
    it('BookConstructor_fromGoogleBooks_ValidParametersCreatesBookInstance_Passes', () => {
        const mockGoogleBooksData = {
            id: 1,
            volumeInfo: {
                title: 'Test Title',
                authors: ['Jane Doe'],
                description: 'This is a test description',
                imageLinks: { thumbnail: 'https://example.com/cover.jpg' },
                publishedDate: '2025-01-01'
            }
        };

        const book = Book.fromGoogleBooks(mockGoogleBooksData);

        expect(book.bookID).to.equal(1);
        expect(book.title).to.equal('Test Title');
        expect(book.authors[0].authorID).to.equal(1);
        expect(book.authors[0].name).to.equal('Jane Doe');
        expect(book.description).to.equal('This is a test description');
        expect(book.cover).to.equal('https://example.com/cover.jpg');
        expect(book.publishedDate).to.equal('2025-01-01');
    });

    it('BookConstructor_fromGoogleBooks_MissingAuthorUsesUnknownAuthorAndCreatesBookInstance_Passes', () => {
        const mockGoogleBooksData = {
            id: '1',
            volumeInfo: {
                title: 'Test Title',
                description: 'This is a test description.',
                imageLinks: { thumbnail: 'https://example.com/cover.jpg' },
                publishedDate: '2025-01-01'
            }
        };

        const book = Book.fromGoogleBooks(mockGoogleBooksData);

        expect(book.bookID).to.equal('1');
        expect(book.title).to.equal('Test Title');
        expect(book.authors[0].authorID).to.equal(0);
        expect(book.authors[0].name).to.equal('Unknown Author');
        expect(book.description).to.equal('This is a test description.');
        expect(book.cover).to.equal('https://example.com/cover.jpg');
        expect(book.publishedDate).to.equal('2025-01-01');
    });
});