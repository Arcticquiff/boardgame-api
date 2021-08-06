const { categoryData, commentData, reviewData, userData } = require('../db/data/test-data/index');
const { formatCategories, formatUsers, formatReviews, formatComments } = require('../db/utils/data-manipulation.js');
//Review array is a file with the test reviews in the correct array format

const reviewArray = require('../db/data/test-data/reviewsArray.js');
describe('formatCategories()', () => {
    it('takes an array of objects and returns the values in a nested array in the correct format', () => {
        expect(formatCategories([{ slug: 'euro-game', description: 'Abstact games that involve little luck' }])).toEqual([['euro-game', 'Abstact games that involve little luck']]);
        expect(formatCategories(categoryData)).toEqual([
            ['euro-game', 'Abstact games that involve little luck'],
            ['social-deduction', "Players attempt to uncover each other's hidden role"],
            ['dexterity', 'Games involving physical skill'],
            ["children's-games", 'Games suitable for children']])
    });
    it('doesn\'t mutate original objects or array', () => {
        const input = categoryData;
        formatCategories(input);
        expect(input).toEqual(categoryData);
    });
    it('returns a new array', () => {
        const input = categoryData;
        expect(formatCategories(input)).not.toBe(input);
    });
});

describe('formatUsers()', () => {
    it('takes an array of objects and returns the object values in a nested array in the correct format', () => {
        expect(formatUsers([{
            username: 'mallionaire',
            name: 'haz',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        }])).toEqual([['mallionaire', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'haz']]);
        expect(formatUsers(userData)).toEqual([
            [
                'mallionaire',
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                'haz'
            ],
            [
                'philippaclaire9',
                'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
                'philippa'
            ],
            [
                'bainesface',
                'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                'sarah'
            ],
            [
                'dav3rid',
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                'dave'
            ]
        ]);
    });
    it('doesn\'t mutate original array of objects', () => {
        const input = userData;
        formatUsers(input);
        expect(input).toEqual(userData);
    });
    it('returns a new array', () => {
        const input = userData;
        expect(formatUsers(input)).not.toBe(input);
    });
});

describe('formatReviews()', () => {
    it('takes an array of objects and returns the object values in a nested array in the correct format', () => {
        expect(formatReviews([{
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro-game',
            created_at: new Date(1610964020514),
            votes: 1
        }])).toEqual([[
            'Agricola',
            'Uwe Rosenberg',
            'mallionaire',
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            'Farmyard fun!',
            'euro-game',
            new Date(1610964020514),
            1
        ]]);
        expect(formatReviews(reviewData)).toEqual(reviewArray);
    });
    it('doesn\'t mutate original objects or array', () => {
        const input = reviewData;
        formatReviews(input);
        expect(input).toEqual(reviewData);
    });
    it('returns a new array', () => {
        const input = reviewData;
        expect(formatReviews(input)).not.toBe(input);
    });
});

describe('formatComments()', () => {
    it('takes an array of objects and returns the object values in a nested array in the correct format', () => {
        expect(formatComments([{
            body: 'I loved this game too!',
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        }], [{ title: 'Jenga', review_id: 1 }])).toEqual([[
            'bainesface',
            1,
            16,
            new Date(1511354613389),
            'I loved this game too!'
        ]]);
    });
    it('doesn\'t mutate original objects or array', () => {
        const input = commentData;
        formatReviews(input);
        expect(input).toEqual(commentData);
    });
    it('returns a new array', () => {
        const input = commentData;
        expect(formatReviews(input)).not.toBe(input);
    });
});
