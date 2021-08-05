const db = require('../db/connection');
const { validateReviewQueries, validatePagination, validateCategory } = require('./helpers');

exports.selectEndpoints = () => {
    return {
        'GET-/api/categories': 'an array of all the categories and a short description',
        'GET-/api/reviews': 'an array of reviews defaulted to limit=5&page=1',
        'GET-/api/reviews/:review_id': 'a single review by parametric id num',
        'PATCH-/api/reviews/:review_id': 'adds a number of votes to review in format { inc_votes: num_of_votes }',
        'GET-/api/reviews/:review_id/comments': 'an array of all comments for the review selected',
        'POST-/api/reviews/:review_id/comments': 'adds a comment to the review in the format { username: "username", body: "comment_body" }'
    }
};
exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then(categories => {
        return categories.rows;
    })
};
exports.selectReview = (review_id) => {
    if (!review_id.match(/^[0-9]+$/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    return db.query(`SELECT *, 
                     (SELECT COUNT(body) AS comment_count 
                     FROM comments 
                     WHERE review_id=$1)
                     FROM reviews
                     WHERE reviews.review_id=$1;`, [review_id])
        .then(review => {
            if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
            return review.rows[0];
        });
};
exports.selectReviewComments = (review_id) => {
    if (!review_id.match(/^[0-9]+$/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    return db.query(`SELECT comment_id, author, votes, created_at, body
                     FROM comments
                     WHERE comments.review_id = $1`, [review_id])
        .then(comments => {
            if (comments.rows.length === 0) return Promise.reject({ status: 404, message: 'no comments found' })
            return comments.rows;
        });
};
exports.selectReviews = (queries) => {
    //checks for validity using helper funcs
    const validQueries = validateReviewQueries(queries);
    const validPages = validatePagination(queries);
    const validCategory = validateCategory(queries);
    if (!validQueries || !validPages) return Promise.reject({ status: 400, message: 'invalid query' });
    if (!validCategory) return Promise.reject({ status: 404, message: "category does not exist" });
    //destuct queries to grab relevent variables 
    const { sort_by = `created_at`, order_by = 'DESC', category, page = 1, limit = 5 } = queries;
    //base query string defined inc the columns to return, left join so we return reviews without any comments
    let queryStr = `SELECT reviews.review_id, reviews.title,
                    reviews.review_img_url, reviews.votes, reviews.category, 
                    reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count 
                    FROM reviews 
                    LEFT JOIN comments 
                    ON comments.review_id = reviews.review_id`;
    //WHERE for category query
    if (category) queryStr += ` WHERE reviews.category = '${category}'`
    //group by added here to preserve correct order
    queryStr += ' GROUP BY reviews.review_id'
    //order of the response dictated by 2 vars, if order_by is ASC it will exclude order_by as by default it is ASC
    queryStr += ` ORDER BY reviews.${sort_by}`;
    if (order_by === 'DESC') queryStr += ` ${order_by}`;
    //pagination
    const offset = (page - 1) * limit
    queryStr += ` LIMIT ${limit} OFFSET ${offset}`
    //query execution and rows passed back to controller
    return db.query(queryStr + ';').then(reviews => {
        return { totalcount: reviews.rows.length, reviews: reviews.rows };
    });
};
exports.updateReviewVotes = (review_id, newReview) => {
    const { inc_votes: votes } = newReview;
    if (!votes || typeof votes !== 'number') return Promise.reject({ status: 400, message: 'bad request' })
    if (!review_id.match(/^[0-9]+$/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    if (Object.keys(newReview).length > 1) return Promise.reject({ status: 400, message: 'bad request' })
    return db.query(`UPDATE reviews
                     SET votes = votes + $1
                     WHERE review_id = $2
                     RETURNING *;`, [votes, review_id])
        .then(review => {
            if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
            return review.rows[0];
        });
};
exports.insertComment = (review_id, comment) => {
    if (Object.keys(comment).length > 2) return Promise.reject({ status: 400, message: 'bad request' })
    if (!review_id.match(/^[0-9]+$/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    return db.query(`INSERT INTO comments 
    (review_id, author, body)
    VALUES 
    ($1, $2, $3) RETURNING *;`, [review_id, comment.username, comment.body])
        .then(comment => {
            return comment.rows[0];
        });
};