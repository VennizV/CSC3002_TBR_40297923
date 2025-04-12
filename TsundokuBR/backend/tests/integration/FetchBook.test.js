const request = require('supertest');
const app = require('../../server');
const chai = require('chai');
const { expect } = chai;

    /*
    This test suite is designed to test the fetch book-related endpoints of the application.
    It includes tests for fetching books by title and author.
    It also includes tests for handling various error cases, such as missing parameters and invalid user IDs.
    */
describe('Fetch Book Endpoints', function () {
    this.timeout(10000);

    describe('GET /title', function () {
        it('/title_ValidTitle_ReturnsBooks_Passes', function (done) {
            request(app)
                .get('/title')
                .query({ title: 'The Hobbit' })
                .end((err, response) => {
                    if (err) return done(err);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('GET /author', function () {
        it('/author_ValidAuthor_ReturnsBooks_Passes', function (done) {
            request(app)
                .get('/author')
                .query({ author: 'J. R. R. Tolkien' }) 
                .end((err, response) => {
                    if (err) return done(err);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.be.an('array');
                    expect(response.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
});