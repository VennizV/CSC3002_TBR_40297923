const chai = require('chai');
const expect = chai.expect;
const Author = require('../../Classes/Author.js');

    /*
    Test Suite for Author Class
    - Tests the constructor and its parameters
    */
describe('Author Class', () => {
    it('AuhtorConstructor_fromGoogleBooks_ValidParametersCreatesAuhtorInstance_Passes', () => {
        const mockGoogleBooksData = { 
            authorID: 1, 
            name: 'Jane Doe' 
        };

        const author = new Author(mockGoogleBooksData.authorID, mockGoogleBooksData.name);

        expect(author.authorID).to.equal(1);
        expect(author.name).to.equal('Jane Doe');
    });
});