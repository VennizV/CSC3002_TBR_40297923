const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const cron = require('node-cron');
const BubbleServices = require('../../Services/BubbleServices');

    /*
    Mock MySQL connection and cron job for testing purposes.
    This allows us to simulate database interactions and scheduled tasks without needing a real database or cron job.
    - getTimeBubbleStatus: Retrieves the time bubble status for a given user ID.
    - updateTimeBubbleStatus: Updates the time bubble status for a given user ID.
    - getTimeBubbleCount: Retrieves the time bubble count for a given user ID.
    - incrementTimeBubbleCount: Increments the time bubble count for a given user ID.
    - decrementTimeBubbleCount: Decrements the time bubble count for a given user ID.
    - getAllUsersWithActiveBubbles: Retrieves all users with active time bubbles.
    */
describe('BubbleServices Class', () => {
    let bubbleServices;
    let mockDb;

    beforeEach(() => {
        // Mock MySQL connection
        mockDb = {
            query: sinon.stub(),
            connect: sinon.stub(),
        };
        sinon.stub(require('mysql2'), 'createConnection').returns(mockDb);
        sinon.stub(cron, 'schedule').callsFake((schedule, callback) => {
            callback();
        });
        bubbleServices = new BubbleServices();
    });

    afterEach(() => {
        sinon.restore();
    });

describe('getTimeBubbleStatus', () => {
    it('getTimeBubbleStatus_ValidUserId_ReturnsStatus_Passes', async () => {
        const mockQueryResult = [{ timeBubbleStatus: 1 }];
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;
        const status = await bubbleServices.getTimeBubbleStatus(userId);

        expect(status).to.equal(1);
    });

    it('getTimeBubbleStatus_InvalidUserId_ThrowsError', async () => {
        mockDb.query.callsArgWith(2, null, []);

        const userId = 99;

        try {
            await bubbleServices.getTimeBubbleStatus(userId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('User not found');
        }
    });
});

describe('getTimeBubbleStatus', () => {
    it('updateTimeBubbleStatus_ToggleStatusFromOffToOn_Passes', async () => {
        const mockQueryResult = { affectedRows: 1 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;
        const status = true;
        const count = 5;

        const result = await bubbleServices.updateTimeBubbleStatus(userId, status, count);

        expect(result).to.deep.equal({ status: 1, count: 5 });
    });
});

describe('getTimeBubbleCount', () => {
    it('getTimeBubbleCount_ValidUserId_ReturnsCount_Passes', async () => {
        const mockQueryResult = [{ timeBubbleCount: 5 }];
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;
        const count = await bubbleServices.getTimeBubbleCount(userId);

        expect(count).to.equal(5);
    });

    it('getTimeBubbleCount_InvalidUserId_ThrowsError', async () => {
        mockDb.query.callsArgWith(2, null, []);

        const userId = 99;

        try {
            await bubbleServices.getTimeBubbleCount(userId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('User not found');
        }
    });
});

describe('incrementTimeBubbleCount', () => {
    it('incrementTimeBubbleCount_ValidUserId_IncrementsCount_Passes', async () => {
        const mockQueryResult = { affectedRows: 1 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 1;

        await bubbleServices.incrementTimeBubbleCount(userId);

        expect(mockDb.query.calledOnce).to.be.true;
        expect(mockDb.query.firstCall.args[0]).to.include('UPDATE User SET timeBubbleCount = timeBubbleCount + 1 WHERE user_id = ?');
        expect(mockDb.query.firstCall.args[1]).to.deep.equal([userId]);
    });

    it('incrementTimeBubbleCount_InvalidUserId_ThrowsError', async () => {
        const mockQueryResult = { affectedRows: 0 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 99;

        try {
            await bubbleServices.incrementTimeBubbleCount(userId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Error incrementing time bubble count.');
        }
    });
});

describe('decrementTimeBubbleCount', () => {
    it('decrementTimeBubbleCount_ValidUserId_DecrementsCount_Passes', async () => {
        const mockQueryResult = { affectedRows: 1 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);
    
        const userId = 1;
    
        await bubbleServices.decrementTimeBubbleCount(userId);
    
        const actualQuery = mockDb.query.firstCall.args[0].replace(/\s+/g, ' ').trim();
        const expectedQuery = 'UPDATE User SET timeBubbleCount = timeBubbleCount - 1 WHERE user_id = ? AND timeBubbleCount > 0 AND timeBubbleStatus = 1';
    
        expect(actualQuery).to.equal(expectedQuery);
        expect(mockDb.query.calledOnce).to.be.true;
        expect(mockDb.query.firstCall.args[1]).to.deep.equal([userId]);
    });

    it('decrementTimeBubbleCount_InvalidUserId_ThrowsError', async () => {
        const mockQueryResult = { affectedRows: 0 };
        mockDb.query.callsArgWith(2, null, mockQueryResult);

        const userId = 99;

        try {
            await bubbleServices.decrementTimeBubbleCount(userId);
        } catch (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.message).to.equal('Cannot decrement count. Either bubble is off or count is already zero.');
        }
    });
});

describe('getAllUsersWithActiveBubbles', () => {
    it('getAllUsersWithActiveBubbles_ReturnsActiveUsers_Passes', async () => {
        const mockQueryResult = [
            { user_id: 1, timeBubbleCount: 5, timeBubbleStatus: 1 },
            { user_id: 2, timeBubbleCount: 3, timeBubbleStatus: 1 },
        ];
        mockDb.query.callsArgWith(1, null, mockQueryResult);

        const activeUsers = await bubbleServices.getAllUsersWithActiveBubbles();

        expect(activeUsers).to.deep.equal(mockQueryResult);
        expect(mockDb.query.calledOnce).to.be.true;
        expect(mockDb.query.firstCall.args[0]).to.include('SELECT user_id, timeBubbleCount, timeBubbleStatus FROM User WHERE timeBubbleStatus = 1');
    });
});
});