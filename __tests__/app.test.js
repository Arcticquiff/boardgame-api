const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET - /api/categories', () => {
    test('200 - should return an array of category objects, each of which should have keys of slug and description', () => {
        return request(app).get('/api/categories').expect(200).then(result => {
            expect(result.body).toEqual({ "categories": [{ "description": "Abstact games that involve little luck", "slug": "euro game" }, { "description": "Players attempt to uncover each other's hidden role", "slug": "social deduction" }, { "description": "Games involving physical skill", "slug": "dexterity" }, { "description": "Games suitable for children", "slug": "children's games" }] });
        });
    });
});