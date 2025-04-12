const chai = require('chai');
const expect = chai.expect;
const User = require('../../Classes/User.js');
const Account = require('../../Classes/Account.js');
const Levels = require('../../Classes/Levels.js');

    /*
    Test Suite for User Class
    - Tests the constructor and its parameters
    */
describe('User Class', () => {
    let levels;

    beforeEach(() => {
        account = new Account(1, 'testUser', 'password');
        levels = Levels.MODERATE; 
    });

    it('UserConstructor_ValidParametersCreatesUserInstance_Passes', () => {
        user = new User(1, account, levels, 'off', 0, 0, 0);

        expect(user.id).to.equal(1);
        expect(user.account.username).to.equal('testUser');
        expect(user.account.password).to.equal('password');
        expect(user.readingLevel).to.equal(Levels.MODERATE);
        expect(user.timeBubbleStatus).to.equal('off');
        expect(user.timeBubbleCount).to.equal(0);
        expect(user.totalTBR).to.equal(0);
        expect(user.totalRead).to.equal(0);
    });
});