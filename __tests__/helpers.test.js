const { validateReviewQueries, validatePagination, validateCategory } = require('../MVC/helpers');

describe('validateReviewQueries()', () => {
    test('returns true as a base when passed an object', () => {
        expect(validateReviewQueries({})).toBe(true);
    });
    test('returns false if passed an invalid query on an accepted key', () => {
        expect(validateReviewQueries({ sort_by: 'undefined' })).toBe(false);
    });
    test('doesn\'t mutate original object', () => {
        const input = { sort_by: 'not_a_column' };
        validateReviewQueries(input);
        expect(input).toEqual({ sort_by: 'not_a_column' });
    });
});
describe('validatePagination()', () => {
    test('returns true as a base when passed an object', () => {
        expect(validatePagination({})).toBe(true);
    });
    test('returns false if passed an invalid query on an accepted key', () => {
        expect(validatePagination({ limit: 'undefined' })).toBe(false);
    });
    test('doesn\'t mutate original object', () => {
        const input = { limit: 'not_a_number' };
        validateReviewQueries(input);
        expect(input).toEqual({ limit: 'not_a_number' });
    });
});
describe('validateCategory()', () => {
    test('returns true as a base when passed an object', () => {
        expect(validateCategory({})).toEqual(true);
    });
    test('returns false if passed an invalid query on a key of category', () => {
        expect(validateCategory({ category: 'not_a_category' })).toBe(false);
    });
    test('doesn\'t mutate original object', () => {
        const input = { category: 'not_a_category' };
        validateCategory(input);
        expect(input).toEqual({ category: 'not_a_category' });
    });
});