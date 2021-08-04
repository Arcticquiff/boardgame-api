const reviewsRouter = require('express').Router();
const { getReview, postReviewVotes, getReviews } = require('../MVC/controllers');

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReview).post(postReviewVotes);

module.exports = reviewsRouter;