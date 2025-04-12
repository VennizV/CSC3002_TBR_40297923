const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the account-related endpoints of the application.
    It includes tests for creating an account, logging in, and handling various error cases.
    It also includes tests for checking the existence of the test user and creating it if it doesn't exist.
    */
describe('Account Endpoints', () => {
    const testUser = { username: 'testUser@gmail.com', password: 'testPassword' };

    before(async () => {
        console.log = () => {};
        console.error = () => {};

        const checkResponse = await request(app)
            .post('/login') 
            .send(testUser);

        if (checkResponse.status === 401) {
            await request(app)
                .post('/create-account')
                .send(testUser)
                .then((response) => {
                    if (response.status === 200) {
                        console.log('Test user created successfully.');
                    } else {
                        console.error('Unexpected error while creating test user:', response.body);
                    }
                });
        } else {
            console.log('Test user already exists.');
        }
    });

    describe('POST /create-account', () => {
        it('/create-account_ValidParametersCreatesAccount_Passes', async () => {
            const newTestUser = { username: 'newTestUser@gmail.com', password: 'newTestPassword' };

            const checkResponse = await request(app)
                .post('/login')
                .send(newTestUser);

            if (checkResponse.status === 200) {
                console.log('newTestUser already exists. Skipping creation.');
            } else {
                const response = await request(app)
                    .post('/create-account')
                    .send(newTestUser);

                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('message', 'Account created successfully');
                expect(response.body).to.have.property('user');
            }

            await request(app)
                .post('/delete-account')
                .send({ username: newTestUser.username });
        });

        it('/create-account_MissingParameters_ThrowsError', async () => {
            const response = await request(app)
                .post('/create-account')
                .send({ username: '' });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Username and password are required.');
        });
    });

    describe('POST /login', () => {
        it('/login_ValidParametersLogsUserIn_Passes', async () => {
            const response = await request(app)
                .post('/login')
                .send(testUser);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Login successful');
            expect(response.body).to.have.property('user');
        });

        it('/login_InvalidParametersDoesNotLogin_Fails', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'wrongUser', password: 'wrongPassword' });

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error');
        });

        it('/login_MissingParametersDoesNotLogin_ThrowsError', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: '' });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Username and password are required.');
        });
    });
});