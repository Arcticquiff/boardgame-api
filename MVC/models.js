const db = require('../db/connection');
const { validateReviewQueries, validatePagination, checkCategory, reviewExists, validateReviewKeys, formatReviewData, validateCategoryKeys } = require('./helpers');

exports.selectEndpoints = () => {
    return {
        'GET-/api/categories': 'an array of all the categories and a short description',
        'GET-/api/reviews': 'an array of reviews defaulted to limit=5&page=1',
        'POST-/api/reviews': "add a review to the database in format { owner, title, review_body, designer, category }",
        'GET-/api/reviews/:review_id': 'a single review by parametric id num',
        'PATCH-/api/reviews/:review_id': 'adds a number of votes to review in format { inc_votes: num_of_votes }',
        'GET-/api/reviews/:review_id/comments': 'an array of all comments for the review selected defaulted to limit=5&page=1',
        'POST-/api/reviews/:review_id/comments': 'adds a comment to the review in the format { username: "username", body: "comment_body" }',
        'DELETE-/api/comments/:comment_id': 'deletes a comment by parametric comment_id',
        'PATCH-/api/comments/:comment_id': 'adds votes to selected comment',
        'GET-/api/users': 'an array of username objects',
        'GET-/api/user/username': 'a single user by username'
    }
};
exports.selectCategories = async () => {
    const categories = await db.query('SELECT * FROM categories;')
    return categories.rows;
};
exports.selectUsers = async () => {
    const users = await db.query('SELECT username FROM users;')
    return users.rows;
};
exports.selectUser = async (username) => {
    const user = await db.query('SELECT * FROM users WHERE username = $1;', [username])
    if (user.rows.length === 0) return Promise.reject({ status: 404, message: 'user not found' })
    return user.rows[0];
};
exports.selectReview = async (review_id) => {
    const review = await db.query(`SELECT *, 
                     (SELECT COUNT(body) AS comment_count 
                     FROM comments 
                     WHERE review_id=$1)
                     FROM reviews
                     WHERE reviews.review_id=$1;`, [review_id])
    if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
    return review.rows[0];
};
exports.selectReviewComments = async (review_id, queries) => {
    if (!validatePagination(queries)) return Promise.reject({ status: 400, message: 'invalid query' });
    const { limit = 5, page = 1 } = queries;
    const offset = (page - 1) * limit
    const exists = await reviewExists(review_id);
    if (!exists) return Promise.reject({ status: 404, message: 'review not found' })
    const comments = await db.query(`SELECT comment_id, author, votes, created_at, body
                     FROM comments
                     WHERE comments.review_id = $1
                     LIMIT ${limit} OFFSET ${offset};`, [review_id]);
    return comments.rows;
};
exports.selectReviews = async (queries) => {
    const dbQueries = [];
    if (!validateReviewQueries(queries) || !validatePagination(queries)) return Promise.reject({ status: 400, message: 'invalid query' });
    if (!await checkCategory(queries) && queries.category) return Promise.reject({ status: 404, message: 'category not found' })
    const { sort_by = `created_at`, order_by = 'DESC', category, page = 1, limit = 5 } = queries;
    let queryStr = `SELECT reviews.review_id, reviews.title,
                    reviews.review_img_url, reviews.votes, reviews.category, 
                    reviews.owner, reviews.created_at, COUNT(comments.review_id) AS comment_count 
                    FROM reviews 
                    LEFT JOIN comments 
                    ON comments.review_id = reviews.review_id`;
    if (category) {
        queryStr += ` WHERE reviews.category = $1`
        dbQueries.push(category);
    }
    queryStr += ` GROUP BY reviews.review_id`
    queryStr += ` ORDER BY reviews.${sort_by}`;
    if (order_by === 'DESC') queryStr += ` ${order_by}`;
    const offset = (page - 1) * limit
    queryStr += ` LIMIT ${limit} OFFSET ${offset}`
    const reviews = await db.query(queryStr + ';', dbQueries)
    return { totalcount: reviews.rows.length, reviews: reviews.rows };
};
exports.updateReviewVotes = async (review_id, newReview) => {
    const { inc_votes: votes } = newReview;
    const review = await db.query(`UPDATE reviews
                                   SET votes = votes + $1
                                   WHERE review_id = $2
                                   RETURNING *;`, [votes, review_id])
    if (review.rows.length === 0) return Promise.reject({ status: 404, message: 'review not found' })
    return review.rows[0];
};
exports.insertComment = async (review_id, comment) => {
    const insertedComment = await db.query(`INSERT INTO comments 
                                            (review_id, author, body)
                                            VALUES 
                                            ($1, $2, $3) RETURNING *;`, [review_id, comment.username, comment.body])
    return insertedComment.rows[0];
};
exports.insertReview = async (review) => {
    if (!validateReviewKeys(review)) return Promise.reject({ status: 400, message: 'invalid or missing key on review object' });
    const insertedReview = await db.query(`INSERT INTO reviews
                                            (title, review_body, owner, designer, category)
                                            VALUES
                                            ($1, $2, $3, $4, $5) RETURNING *`, formatReviewData(review));
    insertedReview.rows[0].comment_count = 0;
    return insertedReview.rows[0];
};
exports.insertCategory = async (category) => {
    if (!validateCategoryKeys(category)) return Promise.reject({ status: 400, message: 'invalid or missing key on category object' });
    const insertedCategory = await db.query(`INSERT INTO categories
                                             (slug, description)
                                             VALUES
                                             ($1, $2) RETURNING *`, [category.slug, category.description]);
    return insertedCategory.rows[0];
};
exports.removeComment = async (comment_id) => {
    const comment = await db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    if (comment.rows.length === 0) return Promise.reject({ status: 404, message: 'no comment found' });
    return;
};
exports.updateCommentVotes = async (comment_id, comment_body) => {
    const { inc_votes: votes } = comment_body;
    const updatedComment = await db.query(`UPDATE comments 
                                          SET votes = $1 
                                          WHERE comment_id = $2 
                                          RETURNING *;`, [votes, comment_id])
    if (updatedComment.rows.length === 0) return Promise.reject({ status: 404, message: 'comment not found' })
    return updatedComment.rows[0];
};