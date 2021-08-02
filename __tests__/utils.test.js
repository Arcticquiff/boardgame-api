const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data/index');
const { formatCategory } = require('../db/utils/data-manipulation.js');


describe('formatCategory()', () => {
    it('takes an array with objects that have two key/value pairs and returns the values in an array in the correct order', () => {
        expect(formatCategory([{ slug: 'euro game', description: 'Abstact games that involve little luck' }])).toEqual([['euro game', 'Abstact games that involve little luck']]);
        expect(formatCategory(categoryData)).toEqual([
            ['euro game', 'Abstact games that involve little luck'],
            ['social deduction', "Players attempt to uncover each other's hidden role"],
            ['dexterity', 'Games involving physical skill'],
            ["children's games", 'Games suitable for children']])
    });
    it('doesn\'t mutate original objects or array', () => {
        const input = categoryData;
        formatCategory(input);
        expect(input).toEqual(categoryData);
    });
    it('returns a new array', () => {
        const input = categoryData;
        expect(formatCategory(input)).not.toBe(input);
    });
});