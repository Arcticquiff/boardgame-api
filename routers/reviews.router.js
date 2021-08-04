const reviewsRouter = require('express').Router();
const { getReview, patchReviewVotes, getReviews } = require('../MVC/controllers');

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReview).post(patchReviewVotes);

module.exports = reviewsRouter;