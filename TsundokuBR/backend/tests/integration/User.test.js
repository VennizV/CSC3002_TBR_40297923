const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the user-related endpoints of the application.
    It includes tests for getting the TBR (To Be Read) count and books.
    It also includes tests for handling various error cases, such as missing parameters and invalid user IDs.
    */
describe('User Endpoints', function () {
    this.timeout(10000);

    describe('GET /tbr', function () {
        it('/tbr_ValidUserId_ReturnsTBRCount_Passes', async () => {
            const response = await request(app)
                .get('/tbr')
                .query({ userId: 1 }); 
                
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('totalBooksInTBR');
            expect(response.body.totalBooksInTBR).to.be.a('number');
        });

        it('/tbr_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .get('/tbr');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });
    });

    describe('GET /tbr/books', function () {
        it('/tbr/books_ValidUserId_ReturnsTBRBooks_Passes', async () => {
            const response = await request(app)
                .get('/tbr/books')
                .query({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('/tbr/books_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .get('/tbr/books');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });
    });
});