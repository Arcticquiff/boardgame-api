const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
    test('ANY - 400 - responds with message if incorrect request path', () => {
        return request(app).get('/api/not_a_path').expect(400).then(result => {
            expect(typeof result.body).toBe('object');
            expect(result.body).toHaveProperty('message');
            expect(result.body.message).toEqual('incorrect path');
        });
    });
    describe('/categories', () => {
        test('GET - 200 - responds with an array of category objects, each of which should have keys of slug and description', () => {
            return request(app).get('/api/categories').expect(200).then(result => {
                expect(typeof result.body).toBe('object');
                expect(result.body).toHaveProperty('categories');
                expect(Array.isArray(result.body.categories)).toBe(true);
                expect(result.body.categories).toHaveLength(4);
                result.body.categories.forEach(category => {
                    expect(category).toHaveProperty('slug');
                    expect(category).toHaveProperty('description');
                });
            });
        });
    });
    describe.only('/reviews', () => {
        describe('/:review_id', () => {
            test('GET - 200 - responds with an object with a key of "review" and a value of the review object', () => {
                return request(app).get('/api/reviews/1').expect(200).then(result => {
                    expect(typeof result.body).toBe('object');
                    expect(result.body).toHaveProperty('review');
                    expect(typeof result.body.review).toBe('object');
                    expect(result.body.review).toHaveProperty('owner');
                    expect(result.body.review).toHaveProperty('title');
                    expect(result.body.review).toHaveProperty('review_id');
                    expect(result.body.review).toHaveProperty('review_body');
                    expect(result.body.review).toHaveProperty('designer');
                    expect(result.body.review).toHaveProperty('review_img_url');
                    expect(result.body.review).toHaveProperty('category');
                    expect(result.body.review).toHaveProperty('created_at');
                    expect(result.body.review).toHaveProperty('votes');
                    expect(result.body.review).toHaveProperty('comment_count');
                });
            });
            test('GET - 400 - if invalid param responds with err message', () => {
                return request(app).get('/api/reviews/not_a_vailid_param').expect(400).then(result => {
                    expect(typeof result.body).toBe('object');
                    expect(result.body).toHaveProperty('message');
                    expect(result.body.message).toEqual('invalid review_id');
                });
            });
            test('GET - 404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                return request(app).get('/api/reviews/1000000').expect(404).then(result => {
                    expect(typeof result.body).toBe('object');
                    expect(result.body).toHaveProperty('message');
                    expect(result.body.message).toEqual('review not found');
                });
            });
        });
    });
});