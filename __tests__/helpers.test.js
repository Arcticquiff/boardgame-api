const { validateReviewQueries, validatePagination, validateReviewKeys, formatReviewData } = require('../MVC/helpers');

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
describe('validateReviewKeys()', () => {
    test('returns false if passed less than 4 keys', () => {
        expect(validateReviewKeys({})).toBe(false);
    });
    test('returns false if passed any incorrect key', () => {
        expect(validateReviewKeys({ review_body: 1, title: 1, owner: 1, designer: 1, not_a_key: 1 })).toBe(false);
    });
    test('returns true if passed correct keys', () => {
        expect(validateReviewKeys({ review_body: 1, title: 1, owner: 1, designer: 1, category: 1 })).toEqual(true);
    });
    test('returns true if passes correct keys and extra', () => {
        expect(validateReviewKeys({ review_body: 1, title: 1, owner: 1, designer: 1, category: 1, not_a_key: 1 })).toEqual(true);
    });
    test('doesn\'t mutate original object', () => {
        const input = { review_body: 1, title: 1, owner: 1, designer: 1, category: 1 };
        validateReviewKeys(input);
        expect(input).toEqual({ review_body: 1, title: 1, owner: 1, designer: 1, category: 1 });
    });
});
describe('formatReviewData()', () => {
    test('when passed an object with the correct keys returns an array in the correct order', () => {
        expect(formatReviewData({ review_body: 1, title: 2, owner: 3, designer: 4, category: 5 })).toEqual([2, 1, 3, 4, 5]);
    });
    test('doesn\'t mutate original object', () => {
        const input = { review_body: 1, title: 2, owner: 3, designer: 4, category: 5 };
        formatReviewData(input);
        expect(input).toEqual({ review_body: 1, title: 2, owner: 3, designer: 4, category: 5 });
    });
});