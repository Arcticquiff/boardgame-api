const db = require('../db/connection');
const { validateReviewQueries, validatePagination } = require('./helpers');

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
exports.updateReviewVotes = (review_id, votes) => {
    if (!votes || typeof votes !== 'number') return Promise.reject({ status: 400, message: 'bad request' })
    if (!review_id.match(/^[0-9]+$/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    return db.query(`UPDATE reviews
                     SET votes = votes + $1
                     WHERE review_id = $2
                     RETURNING *;`, [votes, review_id])
        .then(review => {
            if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
            return review.rows[0];
        });
};
exports.selectReviews = (queries) => {
    //checks for validity using helper funcs
    const validQueries = validateReviewQueries(queries);
    const validPages = validatePagination(queries);
    if (!validQueries || !validPages) return Promise.reject({ status: 400, message: 'invalid query' });
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
    //order of the response dictated by 2 vars
    queryStr += ` ORDER BY reviews.${sort_by}`;
    if (order_by === 'DESC') queryStr += ` ${order_by}`;
    //pagination
    const offset = (page - 1) * limit
    queryStr += ` LIMIT ${limit} OFFSET ${offset}`
    //query execution and rows passed back to controller
    return db.query(queryStr + ';').then(reviews => {
        return reviews.rows;
    });
};

// 