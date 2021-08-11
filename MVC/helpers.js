const db = require('../db/connection');

exports.validateReviewQueries = (queries) => {
    const { sort_by, order_by } = queries;
    if (!['owner', 'title', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'comment_count', undefined].includes(sort_by) ||
        !['ASC', 'DESC', undefined].includes(order_by)) return false;
    return true;
};
exports.validatePagination = (queries) => {
    const { limit = '0', page = '0' } = queries;
    if (!limit.match(/^[0-9]+$/g)) return false;
    if (!page.match(/^[0-9]+$/g)) return false;
    return true;
};
exports.checkCategory = (queries) => {
    const { category } = queries;
    return db.query('SELECT * FROM categories WHERE slug = $1;', [category]).then(category => {
        if (category.rows.length === 0) return false
        return true;
    })
};
exports.reviewExists = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id]).then(review => {
        if (review.rows.length === 0) return false;
        return true;
    });
};
exports.checkUser = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1;', [username]).then(user => {
        if (user.rows.length === 0) return false;
        return true;
    })
};
exports.validateReviewKeys = (review) => {
    if (Object.keys(review).length < 5) return false;
    let valid = true;
    ['review_body', 'title', 'owner', 'designer', 'category'].forEach(key => {
        if (!Object.keys(review).includes(key)) valid = false;
    });
    return valid;
};
exports.formatReviewData = (review) => {
    return [review.title, review.review_body, review.owner, review.designer, review.category];
};
exports.validateCategoryKeys = (category) => {
    if (Object.keys(category).length < 2) return false;
    let valid = true;
    ['slug', 'description'].forEach(key => {
        if (!Object.keys(category).includes(key)) valid = false;
    });
    return valid;
};