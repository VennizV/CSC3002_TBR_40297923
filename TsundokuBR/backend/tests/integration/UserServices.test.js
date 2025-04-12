const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the reading level-related endpoints of the application.
    It includes tests for getting the reading level and updating it.
    It also includes tests for handling various error cases, such as missing parameters and invalid user IDs.
    */
describe('Reading Level Endpoints', () => {

    before(() => {
        console.log = () => {};
        console.error = () => {};
    });

    describe('GET /level', () => {
        it('/level_ValidUserId_ReturnsReadingLevel_Passes', async () => {
            const response = await request(app)
                .get('/level')
                .query({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('readingLevel');
        });

        it('/level_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .get('/level');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });

        it('/level_InvalidUserId_ReturnsError', async () => {
            const response = await request(app)
                .get('/level')
                .query({ userId: 9999 });

            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('error');
        });
    });

    describe('POST /level', () => {
        it('/level_ValidParameters_UpdatesReadingLevel_Passes', async () => {
            const response = await request(app)
                .post('/level')
                .send({ userId: 1, readingLevel: 'MODERATE' });
        
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Reading level updated successfully');
            expect(response.body).to.have.property('readingLevel', 'MODERATE');
        });

        it('/level_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/level')
                .send({ userId: 1 });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID and reading level are required.');
        });
    });
});