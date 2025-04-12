const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Levels = require('../../Classes/Levels');
const UserServices = require('../../Services/UserServices');

    /*
    UserServices Class Tests
    - getReadingLevelStatus: Tests for getting the reading level status of a user.
    - updateReadingLevelStatus: Tests for updating the reading level status of a user.
    */
describe('UserServices Class', () => {
    let userServices;
    let mockDb;

    beforeEach(() => {
        // Mock MySQL connection
        mockDb = {
            query: sinon.stub(),
            connect: sinon.stub(),
        };
        sinon.stub(require('mysql2'), 'createConnection').returns(mockDb);
        userServices = new UserServices();
    });

    afterEach(() => {
        sinon.restore();
    });

describe('getReadingLevelStatus', () => {
    it('getReadingLevelStatus_ValidUserId_ReturnsReadingLevel_Passes', async () => {
        const mockQueryResult = [{ readingLevel: Levels.MODERATE }];
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;
        const readingLevel = await userServices.getReadingLevelStatus(userId);

        expect(readingLevel).to.equal(Levels.MODERATE);
    });

    it('getReadingLevelStatus_InvalidUserId_ThrowsError', async () => {
        mockDb.query.callsArgWith(2, null, []);
        const userId = 99;

        try {
            await userServices.getReadingLevelStatus(userId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('User not found');
        }
    });
});

describe('updateReadingLevelStatus', () => {
    it('updateReadingLevelStatus_ValidUserId_UpdatesLevel_Passes', async () => {
        const mockQueryResult = { affectedRows: 1 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;
        const newLevel = Levels.HEAVY;
        const updatedLevel = await userServices.updateReadingLevelStatus(userId, newLevel);

        expect(updatedLevel).to.equal(Levels.HEAVY);
    });

    it('updateReadingLevelStatus_InvalidLevel_ThrowsError', async () => {
        const userId = 1;
        const invalidLevel = 'EXTREME';

        try {
            await userServices.updateReadingLevelStatus(userId, invalidLevel);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Invalid reading level');
        }
    });
});
});