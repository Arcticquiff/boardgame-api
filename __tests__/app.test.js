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
                expect(result.body.message).toEqual('incorrect path');
            });
        });
    });
    describe('GET', () => {
        test('200 - returns a list of endpoints to explore', () => {
            return request(app).get('/api').expect(200).then(result => {
                expect(result.body).toEqual({
                    endpoints: {
                        'GET-/api/categories': 'an array of all the categories and a short description',
                        'GET-/api/reviews': 'an array of reviews defaulted to limit=5&page=1',
                        'GET-/api/reviews/:review_id': 'a single review by parametric id num',
                        'PATCH-/api/reviews/:review_id': 'adds a number of votes to review in format { inc_votes: num_of_votes }',
                        'GET-/api/reviews/:review_id/comments': 'an array of all comments for the review selected',
                        'POST-/api/reviews/:review_id/comments': 'adds a comment to the review in the format { username: "username", body: "comment_body" }',
                        'DELETE-/api/comments/:comment_id': 'deletes a comment by parametric comment_id',
                        'GET-/api/users': 'an array of username objects'
                    }
                });
            });
        });
    });
    describe('/comments', () => {
        describe('/:comment_id', () => {
            describe('DELETE', () => {
                test('204 - responds with status if delete is successful', () => {
                    return request(app).delete('/api/comments/1').expect(204);
                });
                test('404 - responds with err if comment doesn\'t exist', () => {
                    return request(app).delete('/api/comments/1000000').expect(404).then(result => {
                        expect(result.body).toEqual({ message: 'no comment found' });
                    });
                });
                test('400 responds with err if invail comment param', () => {
                    return request(app).delete('/api/comments/not_a_param').expect(400).then(result => {
                        expect(result.body).toEqual({ message: 'invalid comment_id' });
                    });
                });
            });
        });
    });
    describe('/users', () => {
        describe('GET', () => {
            test('200 - responds with an array of objects with usernames as the key', () => {
                return request(app).get('/api/users').expect(200).then(result => {
                    expect(result.body.users).toHaveLength(4);
                    result.body.users.forEach(user => {
                        expect(user).toEqual({
                            username: expect.any(String)
                        });
                    });
                });
            });
        });
    });
    describe('/categories', () => {
        describe('GET', () => {
            test('200 - responds with an array of category objects, each of which should have keys of slug and description', () => {
                return request(app).get('/api/categories').expect(200).then(result => {
                    expect(result.body.categories).toHaveLength(4);
                    result.body.categories.forEach(category => {
                        expect(category).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String),
                        })
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
                    result.body.reviews.forEach(review => {
                        expect(review).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            review_img_url: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        })
                    });
                });
            });
            describe('GET-QUERIES', () => {
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
                    test('404 - will respond with message if category does not exist', () => {
                        return request(app).get('/api/reviews?category=not_a_category').expect(404).then(result => {
                            expect(result.body).toEqual({ message: 'Nothing yet' });
                        })
                    });
                });
            });
        });
        describe('/:review_id', () => {
            describe('GET', () => {
                test('200 - responds with an object with a key of "review" and a value of the review object', () => {
                    return request(app).get('/api/reviews/2').expect(200).then(result => {
                        expect(result.body.review).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: 2,
                            review_body: expect.any(String),
                            designer: expect.any(String),
                            review_img_url: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        });
                    });
                });
                test('400 - if invalid review_id param responds with err message', () => {
                    return request(app).get('/api/reviews/not_a_vailid_param').expect(400).then(result => {
                        expect(result.body.message).toEqual('invalid review_id');
                    });
                });
                test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                    return request(app).get('/api/reviews/1000000').expect(404).then(result => {
                        expect(result.body.message).toEqual('review not found');
                    });
                });
            });
            describe('PATCH', () => {
                test('201 - responds with an object with a key of "review" and a value of the updated review object', () => {
                    return request(app).patch('/api/reviews/1').send({ inc_votes: 1 }).expect(201).then(result => {
                        expect(result.body.updatedReview).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            review_body: expect.any(String),
                            designer: expect.any(String),
                            review_img_url: expect.any(String),
                            category: expect.any(String),
                            created_at: expect.any(String),
                            votes: 2
                        })
                    });
                });
                test('400 - if invalid review_id param responds with err message', () => {
                    return request(app).patch('/api/reviews/not_a_vailid_param').send({ inc_votes: 1 }).expect(400).then(result => {
                        expect(result.body.message).toEqual('invalid review_id');
                    });
                });
                test('400 - if object does not have correct key responds with err message', () => {
                    return request(app).patch('/api/reviews/1').send({ incorrect_key: 1 }).expect(400).then(result => {
                        expect(result.body.message).toEqual('bad request');
                    });
                });
                test('400 - if object includes correct key, but has too many keys responds with err message', () => {
                    return request(app).patch('/api/reviews/1').send({ inc_votes: 1, incorrect_key: 1 }).expect(400).then(result => {
                        expect(result.body).toEqual({ message: "unexpected key on request obj" });
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
                            expect(result.body.message).toEqual('invalid review_id');
                        });
                    });
                    test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                        return request(app).get('/api/reviews/1000000/comments').expect(404).then(result => {
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
                            expect(result.body.message).toEqual('invalid review_id');
                        });
                    });
                    test('400 - if incorrect key or too many keys will return err message', () => {
                        return Promise.all([request(app).post('/api/reviews/1/comments').send({ not_a_key: 'bainesface', body: 'good game' }).expect(400).then(result => {
                            expect(result.body).toEqual({ message: 'bad request' });
                        }),
                        request(app).post('/api/reviews/1/comments').send({ username: 'bainesface', body: 'good game', not_a_key: 'bainesface' }).expect(400).then(result => {
                            expect(result.body).toEqual({ message: 'bad request' });
                        })]);
                    });
                    test('404 - if param is valid but review_id doesn\'t exist respond with err message', () => {
                        return request(app).post('/api/reviews/1000000/comments').send({ username: 'bainesface', body: 'good game' }).expect(404).then(result => {
                            expect(result.body.message).toEqual('review not found');
                        });
                    });
                });
            });
        });
    });
});