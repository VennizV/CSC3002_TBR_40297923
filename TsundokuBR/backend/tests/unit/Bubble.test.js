const chai = require('chai');
const expect = chai.expect;
const Bubble = require('../../Classes/Bubble.js');

    /*
    Bubble Class Tests
    - Tests the constructor and its parameters
    */
describe('Bubble Class', () => {
    it('BubbleConstructor_ValidParametersCreatesBubbleInstance_Passes', () => {
        const bubble = new Bubble('on', 3);

        expect(bubble.status).to.equal('on');
        expect(bubble.count).to.equal(3);
        expect(bubble.lastDecrementDate).to.be.instanceOf(Date);
    });
});