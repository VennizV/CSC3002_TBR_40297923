const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the bubble-related endpoints of the application.
    It includes tests for getting the bubble state, updating the bubble state, incrementing and decrementing the bubble count,
    and handling various error cases.
    It also includes tests for checking the bubble state with invalid user IDs and missing parameters/
    */
describe('Bubble Services Endpoints', function () {
    describe('GET /bubble', function () {
        it('/bubble_ValidUserId_ReturnsStatusAndCount_Passes', async () => {
            const response = await request(app)
                .get('/bubble')
                .query({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status');
            expect(response.body).to.have.property('count');
            expect(response.body.count).to.be.a('number');
        });
    });

    describe('POST /bubble', function () {
        it('/bubble_ValidParameters_UpdatesStatusAndCount_Passes', async () => {
            const response = await request(app)
                .post('/bubble')
                .send({ userId: 1, status: true, count: 5 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Bubble state updated successfully');
            expect(response.body).to.have.property('status', true);
            expect(response.body).to.have.property('count', 5);
        });

        it('/bubble_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/bubble')
                .send({ userId: 1 });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID and status are required.');
        });
    });

    describe('POST /bubble/increment', function () {
        it('/bubble/increment_ValidUserId_IncrementsCount_Passes', async () => {
            const response = await request(app)
                .post('/bubble/increment')
                .send({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Bubble count incremented successfully');
            expect(response.body).to.have.property('count');
            expect(response.body.count).to.be.a('number');
        });

        it('/bubble/increment_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .post('/bubble/increment');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });
    });

    describe('POST /bubble/decrement', function () {
        it('/bubble/decrement_ValidUserId_DecrementsCount_Passes', async () => {
            const response = await request(app)
                .post('/bubble/decrement')
                .send({ userId: 1 });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Bubble count decremented successfully');
            expect(response.body).to.have.property('count');
            expect(response.body.count).to.be.a('number');
        });

        it('/bubble/decrement_MissingUserId_ThrowsError', async () => {
            const response = await request(app)
                .post('/bubble/decrement');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'User ID is required.');
        });
    });
});