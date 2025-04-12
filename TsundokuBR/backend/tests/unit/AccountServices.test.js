const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const AccountServices = require('../../Services/AccountServices');
const Levels = require('../../Classes/Levels');
const User = require('../../Classes/User');

    /*
        Test cases for AccountServices class methods
        - createAccount: Creates a new account and user in the database.
        - login: Authenticates a user and retrieves their account information.
    */
describe('AccountServices Class', () => {
    let accountServices;
    let mockDb;

    beforeEach(() => {
        // Mock MySQL connection
        mockDb = {
            query: sinon.stub(),
            connect: sinon.stub(),
        };
        sinon.stub(require('mysql2'), 'createConnection').returns(mockDb);
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    
        accountServices = new AccountServices();
    });
    
    afterEach(() => {
        sinon.restore();
    });

describe('createAccount', () => {
    it('createAccount_ValidCredentials_CreatesAccountAndUser_Passes', async () => {
        const mockAccountInsertResult = { insertId: 1 };
        const mockUserInsertResult = {};

        mockDb.query
            .onFirstCall().callsArgWith(2, null, mockAccountInsertResult)
            .onSecondCall().callsArgWith(2, null, mockUserInsertResult);

        const username = 'validUser';
        const password = 'validPassword';
        const user = await accountServices.createAccount(username, password);

        expect(user).to.be.instanceOf(User);
        expect(user.account).to.equal(1);
        expect(user.readingLevel).to.equal(Levels.MODERATE);
        expect(user.timeBubbleStatus).to.be.false;
        expect(user.timeBubbleCount).to.equal(0);
        expect(user.totalTBR).to.equal(0);
        expect(user.totalRead).to.equal(0);
    });

    it('createAccount_InvalidCredentials_ThrowsError', async () => {
        const mockError = new Error('Database insertion failed');
        mockDb.query.onFirstCall().callsArgWith(2, mockError, null);

        const username = '';
        const password = '';

        try {
            await accountServices.createAccount(username, password);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Database insertion failed');
        }
    });
});

describe('login', () => {
    it('login_ValidCredentials_ReturnsUser_Passes', async () => {
        const mockAccountQueryResult = [
            { account_id: 1, username: 'validUser', password: 'validPassword' },
        ];
        const mockUserQueryResult = [
            {
                user_id: 1,
                readingLevel: Levels.MODERATE,
                timeBubbleStatus: false,
                timeBubbleCount: 0,
                total_InTBR: 0,
                total_inRead: 0,
            },
        ];

        mockDb.query
            .onFirstCall().callsArgWith(2, null, mockAccountQueryResult)
            .onSecondCall().callsArgWith(2, null, mockUserQueryResult);

        const username = 'validUser';
        const password = 'validPassword';
        const user = await accountServices.login(username, password);

        expect(user).to.be.instanceOf(User);
        expect(user.account.username).to.equal('validUser');
        expect(user.readingLevel).to.equal(Levels.MODERATE);
        expect(user.timeBubbleStatus).to.be.false;
        expect(user.timeBubbleCount).to.equal(0);
    });


    it('login_InvalidCredentials_ThrowsError', async () => {
        mockDb.query.onFirstCall().callsArgWith(2, null, []);

        const username = 'wrongUser';
        const password = 'wrongPassword';

        try {
            await accountServices.login(username, password);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Invalid username or password.');
        }
    });
});
});