const reviewsRouter = require('express').Router();
const { getReview, patchReviewVotes, getReviews, getReviewComments, postComment } = require('../MVC/controllers');

reviewsRouter.route('/:review_id/comments').get(getReviewComments).post(postComment);
reviewsRouter.route('/:review_id').get(getReview).patch(patchReviewVotes);
reviewsRouter.route('/').get(getReviews);

module.exports = reviewsRouter;