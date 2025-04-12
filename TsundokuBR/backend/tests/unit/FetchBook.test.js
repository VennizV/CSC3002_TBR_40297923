const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const axios = require('axios');
const FetchBook = require('../../Services/FetchBook');
const Book = require('../../Classes/Book');

    /*
     Test cases for FetchBook class methods
     - fetchBooks: Fetches books from Google Books API based on a query and start index.
     - searchBooks: Searches for books by title or author, combining results from multiple fetches.
     - searchBooksByTitle: Searches for books by title.
     - searchBooksByAuthor: Searches for books by author.
    */
describe('FetchBook Class', () => {
    beforeEach(() => {
                sinon.stub(console, 'log');
                sinon.stub(console, 'error');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('fetchBooks', () => {
        it('fetchBooks_ValidQuery_ReturnsBooks_Passes', async () => {
            const mockResponse = {
                data: {
                    items: [
                        { id: '1', volumeInfo: { title: 'Book 1', authors: ['Author 1'] } },
                        { id: '2', volumeInfo: { title: 'Book 2', authors: ['Author 2'] } }
                    ]
                }
            };

            sinon.stub(axios, 'get').resolves(mockResponse);

            const books = await FetchBook.fetchBooks('Test Query', 0);

            expect(books).to.be.an('array');
            expect(books).to.have.length(2);
            expect(books[0].id).to.equal('1');
            expect(books[0].volumeInfo.title).to.equal('Book 1');
            expect(books[1].id).to.equal('2');
            expect(books[1].volumeInfo.title).to.equal('Book 2');
        });

        it('fetchBooks_InvalidQuery_ThrowsError', async () => {
            sinon.stub(axios, 'get').rejects(new Error('API Error'));

            try {
                await FetchBook.fetchBooks('Test Query', 0);
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.message).to.equal('API Error');
            }
        });
    });

    describe('searchBooks', () => {
        it('searchBooks_ValidQuery_ReturnsCombinedBooks_Passes', async () => {
            const mockResponse = {
                data: {
                    items: [
                        { id: '1', volumeInfo: { title: 'Book 1', authors: ['Author 1'] } },
                        { id: '2', volumeInfo: { title: 'Book 2', authors: ['Author 2'] } }
                    ]
                }
            };

            sinon.stub(axios, 'get').callsFake(async (url) => {
                const startIndex = parseInt(url.match(/startIndex=(\d+)/)[1], 10);
                if (startIndex >= 80) {
                    return { data: { items: [] } };
                }
                return mockResponse;
            });

            const books = await FetchBook.searchBooks('Test Query');

            expect(books).to.be.an('array');
            expect(books).to.have.length(4);
            expect(books[0].id).to.equal('1');
            expect(books[1].id).to.equal('2');
        });

        it('searchBooks_InvalidQuery_ThrowsError', async () => {
            sinon.stub(axios, 'get').rejects(new Error('API Error'));

            try {
                await FetchBook.searchBooks('Test Query');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.message).to.equal('API Error');
            }
        });
    });

    describe('searchBooksByTitle', () => {
        it('searchBooksByTitle_ValidTitle_ReturnsBooks_Passes', async () => {
            const mockResponse = {
                data: {
                    items: [
                        { id: '1', volumeInfo: { title: 'Book 1', authors: ['Author 1'] } },
                        { id: '2', volumeInfo: { title: 'Book 2', authors: ['Author 2'] } }
                    ]
                }
            };

            sinon.stub(axios, 'get').callsFake(async (url) => {
                const startIndex = parseInt(url.match(/startIndex=(\d+)/)[1], 10);
                if (startIndex >= 80) {
                    return { data: { items: [] } };
                }
                return mockResponse;
            });

            const books = await FetchBook.searchBooksByTitle('Test Title');

            expect(books).to.be.an('array');
            expect(books).to.have.length(4);
            expect(books[0].title).to.equal('Book 1');
            expect(books[1].title).to.equal('Book 2');
        });

        it('searchBooksByTitle_InvalidTitle_ThrowsError', async () => {
            sinon.stub(axios, 'get').rejects(new Error('API Error'));

            try {
                await FetchBook.searchBooksByTitle('Test Title');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.message).to.equal('API Error');
            }
        });
    });

    describe('searchBooksByAuthor', () => {
        it('searchBooksByAuthor_ValidAuthor_ReturnsBooks_Passes', async () => {
            const mockResponse = {
                data: {
                    items: [
                        { id: '1', volumeInfo: { title: 'Book 1', authors: ['Author 1'] } },
                        { id: '2', volumeInfo: { title: 'Book 2', authors: ['Author 2'] } }
                    ]
                }
            };

            sinon.stub(axios, 'get').callsFake(async (url) => {
                const startIndex = parseInt(url.match(/startIndex=(\d+)/)[1], 10);
                if (startIndex >= 80) {
                    return { data: { items: [] } };
                }
                return mockResponse;
            });

            const books = await FetchBook.searchBooksByAuthor('Test Author');

            expect(books).to.be.an('array');
            expect(books).to.have.length(4);
            expect(books[0].title).to.equal('Book 1');
            expect(books[1].title).to.equal('Book 2');
        });

        it('searchBooksByAuthor_InvalidAuthor_ThrowsError', async () => {
            sinon.stub(axios, 'get').rejects(new Error('API Error'));

            try {
                await FetchBook.searchBooksByAuthor('Test Author');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.message).to.equal('API Error');
            }
        });
    });
});