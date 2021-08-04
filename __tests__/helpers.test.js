const { validateReviewQueries, validatePagination } = require('../MVC/helpers');

describe('validateReviewQueries()', () => {
    test('returns true as a base when passed an object', () => {
        expect(validateReviewQueries({})).toBe(true);
    });
    test('returns false if passed an invalid query on an accepted key', () => {
        expect(validateReviewQueries({ category: 'undefined' })).toBe(false);
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