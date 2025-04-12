const chai = require('chai');
const expect = chai.expect;
const Account = require('../../Classes/Account.js');

    /*
    Test Suite for Account Class
    - Tests the constructor and its parameters
    */
describe('Account Class', () => {
    it('AccountConstructor_ValidParametersCreatesAccountInstance_Passes', () => {
        account = new Account(1, 'testUser', 'password')

        expect(account.accountID).to.equal(1);
        expect(account.username).to.equal('testUser');
        expect(account.password).to.equal('password');
    });
});