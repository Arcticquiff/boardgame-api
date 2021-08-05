const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
    describe('ANY', () => {
        test('400 - responds with message if incorrect request path', () => {
            return request(app).get('/api/not_a_path').expect(400).then(result => {
                expect(typeof result.body).toBe('object');
                expect(result.body).toHaveProperty('message');
                expect(result.body.message).toEqual('incorrect path');
            });
        });
    });
    describe('GET', () => {
        test.only('200 - returns a list of endpoints to explore', () => {
            return request(app).get('/api').expect(200).then(result => {
                expect(result.body).toEqual({
                    endpoints: {
                        'GET-/api/categories': 'an array of all the categories and a short description',
                        'GET-/api/reviews': 'an array of reviews defaulted to limit=5&page=1',
                        'GET-/api/reviews/:review_id': 'a single review by parametric id num',
                        'PATCH-/api/reviews/:review_id': 'adds a number of votes to review in format { inc_votes: num_of_votes }',
                        'GET-/api/reviews/:review_id/comments': 'an array of all comments for the review selected',
                        'POST-/api/reviews/review_id/comments': 'adds a comment to the review in the format { username: "username", body: "comment_body" }'
                    }
                });
            });
        });
    });
    describe('/categories', () => {
        describe('GET', () => {
            test('200 - responds with an array of category objects, each of which should have keys of slug and description', () => {
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
    });
    describe('/reviews', () => {
        describe('GET', () => {
            test('200 - responds with an array of review objects', () => {
                return request(app).get('/api/reviews').expect(200).then(result => {
                    expect(result.body.reviews.length).toBe(5);
                    expect(typeof result.body).toBe('object');
                    expect(result.body).toHaveProperty('reviews');
                    expect(Array.isArray(result.body.reviews)).toBe(true);
                    result.body.reviews.forEach(review => {
                        expect(review).toHaveProperty('owner');
                        expect(review).toHaveProperty('title');
                        expect(review).toHaveProperty('review_id');
                        expect(review).toHaveProperty('review_img_url');
                        expect(review).toHaveProperty('category');
                        expect(review).toHaveProperty('created_at');
                        expect(review).toHaveProperty('votes');
                        expect(review).toHaveProperty('comment_count');
                    });
                });
            });
            describe('QUERIES', () => {
                describe('pagination', () => {
                    test('200 - returns requested reviews if limit and page are defined', () => {
                        return Promise.all([request(app).get('/api/reviews?limit=3&page=2').expect(200).then(result => {
                            expect(result.body.reviews.length).toBe(3);
                            expect(result.body.reviews[0].title).toEqual("Build you own tour de Yorkshire");
                        }), request(app).get('/api/reviews?limit=10&page=2').expect(200).then(result => {
                            expect(result.body.reviews.length).toBe(3);
                            expect(result.body.reviews[0].title).toEqual("Proident tempor et.");
                        })]);
                    });
                });
                describe('sort_by', () => {
                    test('200 - takes a column name and orders it by that column defaulting to date', () => {
                        return Promise.all([request(app).get('/api/reviews?sort_by=title').expect(200).then(result => {
                            expect(result.body.reviews[0]).toEqual({
                                title: 'Ultimate Werewolf',
                                review_id: 3,
                                owner: 'bainesface',
                                review_img_url:
                                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                                category: 'social deduction',
                                created_at: '2021-01-18T10:01:41.251Z',
                                votes: 5,
                                comment_count: "3"
                            });
                        }), request(app).get('/api/reviews').expect(200).then(result => {
                            expect(result.body.reviews[0]).toEqual({
                                title: 'Mollit elit qui incididunt veniam occaecat cupidatat',
                                owner: 'mallionaire',
                                review_img_url:
                                    'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                                category: 'social deduction',
                                created_at: '2021-01-25T11:16:54.963Z',
                                votes: 9,
                                comment_count: "0",
                                review_id: 7
                            });
                        })]);
                    });
                });
                describe('order_by', () => {
                    test('200 - if passed ASC will change the direction of the order', () => {
                        return Promise.all([request(app).get('/api/reviews?order_by=ASC').expect(200).then(result => {
                            expect(result.body.reviews[0].title).toEqual("Settlers of Catan: Don't Settle For Less");
                            expect(result.body.reviews[0].created_at).toEqual("1970-01-10T02:08:38.400Z");
                        }), request(app).get('/api/reviews?order_by=ASC&&sort_by=title').expect(200).then(result => {
                            expect(result.body.reviews[0].title).toEqual("Agricola");
                        })]);
                    });
                });
                describe('category', () => {
                    test('200 - will respond with only the rows matching the catagory in the query', () => {
                        return Promise.all([request(app).get('/api/reviews?category=social deduction').expect(200).then(result => {
                            expect(result.body.reviews[0].title).toEqual("Mollit elit qui incididunt veniam occaecat cupidatat");
                            expect(result.body.reviews[1].title).toEqual("Dolor reprehenderit");
                        }), request(app).get('/api/reviews?category=dexterity').expect(200).then(result => {
                            expect(result.body.reviews[0].title).toEqual("Jenga");
                        })]);
                    });
                });
                describe('Errors', () => {
                    test('400 - will respond with err if bad query', () => {
                        return Promise.all([request(app).get('/api/reviews?order_by=not_an_order').expect(400).then(result => {
                            expect(result.body).toEqual({ "message": "invalid query" });
                        }), request(app).get('/api/reviews?sort_by=not_a_column').expect(400).then(result => {
                            expect(result.body).toEqual({ "message": "invalid query" });
                        }), request(app).get('/api/reviews?limit=not_a_limit').expect(400).then(result => {
                            expect(result.body).toEqual({ "message": "invalid query" });
                        })]);
                    });
                    test('404 - will respond with error if category does not exist', () => {
                        return request(app).get('/api/reviews?category=not_a_category').expect(404).then(result => {
                            expect(result.body).toEqual({ "message": "category does not exist" });
                        })
                    });
                });
            });
        });
        describe('/:review_id', () => {
            describe('GET', () => {
                test('200 - responds with an object with a key of "review" and a value of the review object', () => {
                    return request(app).get('/api/reviews/2').expect(200).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('review');
                        expect(typeof result.body.review).toBe('object');
                        expect(result.body.review).toHaveProperty('owner');
                        expect(result.body.review).toHaveProperty('title');
                        expect(result.body.review).toHaveProperty('review_id');
                        expect(result.body.review.review_id).toBe(2);
                        expect(result.body.review).toHaveProperty('review_body');
                        expect(result.body.review).toHaveProperty('designer');
                        expect(result.body.review).toHaveProperty('review_img_url');
                        expect(result.body.review).toHaveProperty('category');
                        expect(result.body.review).toHaveProperty('created_at');
                        expect(result.body.review).toHaveProperty('votes');
                        expect(result.body.review).toHaveProperty('comment_count');
                    });
                });
                test('400 - if invalid review_id param responds with err message', () => {
                    return request(app).get('/api/reviews/not_a_vailid_param').expect(400).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('message');
                        expect(result.body.message).toEqual('invalid review_id');
                    });
                });
                test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                    return request(app).get('/api/reviews/1000000').expect(404).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('message');
                        expect(result.body.message).toEqual('review not found');
                    });
                });
            });
            describe('PATCH', () => {
                test('201 - responds with an object with a key of "review" and a value of the updated review object', () => {
                    return request(app).patch('/api/reviews/1').send({ inc_votes: 1 }).expect(201).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('updatedReview');
                        expect(result.body.updatedReview).toHaveProperty('owner');
                        expect(result.body.updatedReview).toHaveProperty('title');
                        expect(result.body.updatedReview).toHaveProperty('review_id');
                        expect(result.body.updatedReview).toHaveProperty('review_body');
                        expect(result.body.updatedReview).toHaveProperty('designer');
                        expect(result.body.updatedReview).toHaveProperty('review_img_url');
                        expect(result.body.updatedReview).toHaveProperty('category');
                        expect(result.body.updatedReview).toHaveProperty('created_at');
                        expect(result.body.updatedReview).toHaveProperty('votes');
                        expect(result.body.updatedReview.votes).toBe(2);
                    });
                });
                test('400 - if invalid review_id param responds with err message', () => {
                    return request(app).patch('/api/reviews/not_a_vailid_param').send({ inc_votes: 1 }).expect(400).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('message');
                        expect(result.body.message).toEqual('invalid review_id');
                    });
                });
                test('400 - if object does not have correct key responds with err message', () => {
                    return request(app).patch('/api/reviews/1').send({ incorrect_key: 1 }).expect(400).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('message');
                        expect(result.body.message).toEqual('bad request');
                    });
                });
                test('400 - if object includes correct key, but has too many keys responds with err message', () => {
                    return request(app).patch('/api/reviews/1').send({ inc_votes: 1, incorrect_key: 1 }).expect(400).then(result => {
                        expect(result.body).toEqual({ message: 'bad request' });
                    });
                });
                test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                    return request(app).patch('/api/reviews/1000000').send({ inc_votes: 1 }).expect(404).then(result => {
                        expect(typeof result.body).toBe('object');
                        expect(result.body).toHaveProperty('message');
                        expect(result.body.message).toEqual('review not found');
                    });
                });
            });
            describe('/comments', () => {
                describe('GET', () => {
                    test('200 - responds with an array of comment objects for the given review', () => {
                        return request(app).get('/api/reviews/2/comments').expect(200).then(result => {
                            result.body.comments.forEach(comment => {
                                expect(comment).toEqual({
                                    "author": expect.any(String),
                                    "body": expect.any(String),
                                    "comment_id": expect.any(Number),
                                    "created_at": expect.any(String),
                                    "votes": expect.any(Number),
                                });
                            });
                            expect(result.body.comments).toHaveLength(3);
                        });
                    });
                    test('400 - if invalid review_id param responds with err message', () => {
                        return request(app).get('/api/reviews/not_a_vailid_param/comments').expect(400).then(result => {
                            expect(typeof result.body).toBe('object');
                            expect(result.body).toHaveProperty('message');
                            expect(result.body.message).toEqual('invalid review_id');
                        });
                    });
                    test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                        return request(app).get('/api/reviews/1000000/comments').expect(404).then(result => {
                            expect(typeof result.body).toBe('object');
                            expect(result.body).toHaveProperty('message');
                            expect(result.body.message).toEqual('no comments found');
                        });
                    });
                });
                describe('POST', () => {
                    test('201 - responds with newly added comment', () => {
                        return request(app).post('/api/reviews/1/comments').send({ username: 'bainesface', body: 'good game' }).expect(201).then(result => {
                            expect(result.body.comment).toEqual({
                                comment_id: expect.any(Number),
                                author: expect.any(String),
                                review_id: 1,
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                body: expect.any(String)
                            });
                        });
                    });
                    test('400 - if invalid review_id param responds with err message', () => {
                        return request(app).post('/api/reviews/not_a_vailid_param/comments').send({ username: 'bainesface', body: 'good game' }).expect(400).then(result => {
                            expect(typeof result.body).toBe('object');
                            expect(result.body).toHaveProperty('message');
                            expect(result.body.message).toEqual('invalid review_id');
                        });
                    });
                    test('400 - if incorrect key or too many keys will return err message', () => {
                        return Promise.all([request(app).post('/api/reviews/1/comments').send({ not_a_key: 'bainesface', body: 'good game' }).expect(400).then(result => {
                            expect(result.body).toEqual({ message: 'bad request' });
                        }), request(app).post('/api/reviews/1/comments').send({ username: 'bainesface', body: 'good game', not_a_key: 'bainesface' }).expect(400).then(result => {
                            expect(result.body).toEqual({ message: 'bad request' });
                        })]);
                    });
                    test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                        return request(app).post('/api/reviews/1000000/comments').send({ username: 'bainesface', body: 'good game' }).expect(404).then(result => {
                            expect(typeof result.body).toBe('object');
                            expect(result.body).toHaveProperty('message');
                            expect(result.body.message).toEqual('review not found');
                        });
                    });
                });
            });
        });
    });
});