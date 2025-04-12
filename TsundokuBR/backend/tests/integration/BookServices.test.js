const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the book-related endpoints of the application.
    It includes tests for adding a book to the TBR (To Be Read) list, setting the current read,
    deleting a book from the TBR list, and moving a book to the read shelf.
    It also includes tests for handling various error cases, such as missing parameters and invalid user IDs.
    */
describe('Book Services Endpoints', () => {
    const testUser = { username: 'testUser@gmail.com', password: 'testPassword' };
    let testBookId = null;

    before(async () => {
        console.log = () => {};
        console.error = () => {};

        const checkResponse = await request(app)
            .post('/login')
            .send(testUser);

        if (checkResponse.status === 401) {
            await request(app)
                .post('/create-account')
                .send(testUser);
        }

        const addBookResponse = await request(app)
            .post('/api/addBookToTBR')
            .send({
                userId: 1,
                bookData: {
                    title: 'The Hobbit',
                    author: 'J.R.R. Tolkien',
                    description: 'A fantasy novel by J.R.R. Tolkien.',
                    cover: 'http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&source=gbs_api',
                    published_date: '1937-09-21',
                },
            });

        if (addBookResponse.status === 200) {
            testBookId = addBookResponse.body.bookId;
        }
    });

    after(async () => {
        if (testBookId) {
            await request(app)
                .post('/api/deleteBookFromTBR')
                .send({ userId: 1, bookId: testBookId });
        }

        await request(app)
            .post('/delete-account')
            .send({ username: testUser.username });
    });

    describe('GET /api/getCurrentRead', () => {
        /*it('/api/getCurrentRead_ValidUserId_ReturnsCurrentRead_Passes', async () => {
            const response = await request(app)
                .get('/api/getCurrentRead')
                .query({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('book_id');
            expect(response.body).to.have.property('title');
        });*/

        it('/api/getCurrentRead_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .get('/api/getCurrentRead');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });

        it('/api/getCurrentRead_NoCurrentRead_ReturnsNotFound', async () => {
            const response = await request(app)
                .get('/api/getCurrentRead')
                .query({ userId: 9999 });

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'No current read found for this user.');
        });
    });

    describe('POST /api/deleteBookFromTBR', () => {
        /*it('/api/deleteBookFromTBR_ValidParameters_DeletesBook_Passes', async () => {
            const response = await request(app)
                .post('/api/deleteBookFromTBR')
                .send({ userId: 1, bookId: testBookId });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
        });*/

        it('/api/deleteBookFromTBR_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/api/deleteBookFromTBR')
                .send({ userId: 1 });
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID and Book ID are required.');
        });
    });

    describe('POST /api/setCurrentRead', () => {
        /*it('/api/setCurrentRead_ValidParameters_SetsCurrentRead_Passes', async () => {
            const response = await request(app)
                .post('/api/setCurrentRead')
                .send({ userId: 1, bookId: testBookId });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
        });*/

        it('/api/setCurrentRead_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/api/setCurrentRead')
                .send({ userId: 1 });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID and Book ID are required.');
        });
    });

    describe('GET /api/books', () => {
        /*it('/api/books_ReturnsAllBooks_Passes', async () => {
            const response = await request(app)
                .get('/api/books');

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });*/
    });

    describe('POST /api/addBookToTBR', () => {
        /*it('/api/addBookToTBR_ValidParameters_AddsBook_Passes', async () => {
            const response = await request(app)
                .post('/api/addBookToTBR')
                .send({
                    userId: 1,
                    bookData: {
                        title: 'The Silmarillion',
                        author: 'J.R.R. Tolkien',
                        description: 'A prequel to The Hobbit and The Lord of the Rings.',
                        cover: 'http://books.google.com/books/content?id=hLH0dtl5NVwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                        published_date: '1977-09-15',
                    },
                });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
        });*/

        it('/api/addBookToTBR_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/api/addBookToTBR')
                .send({ userId: 1 }); 

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('message', 'Missing userId or bookData');
        });
    });

    describe('POST /api/moveToReadShelf', () => {
        /*it('/api/moveToReadShelf_ValidParameters_MovesBook_Passes', async () => {
            const response = await request(app)
                .post('/api/moveToReadShelf')
                .send({ userId: 1, bookCover: 'hobbit-cover.jpg' });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
        });*/

        it('/api/moveToReadShelf_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/api/moveToReadShelf')
                .send({ userId: 1 });

            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('success', false);
        });
    });
});