const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then(categories => {
        return categories.rows;
    })
};
exports.selectReview = (review_id) => {
    if (!review_id.match(/[0-9]+/g)) return Promise.reject({ status: 400, message: 'invalid review_id' })
    return db.query(`SELECT *, (SELECT COUNT(body) AS comment_count FROM comments WHERE review_id=$1)
    FROM reviews
    WHERE reviews.review_id=$1;`, [review_id])
        .then(review => {
            if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
            return review.rows[0];
        });
};
