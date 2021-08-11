const reviewsRouter = require('express').Router();
const { getReview, patchReviewVotes, getReviews, getReviewComments, postComment, postReview } = require('../MVC/controllers');

reviewsRouter.route('/:review_id/comments').get(getReviewComments).post(postComment);
reviewsRouter.route('/:review_id').get(getReview).patch(patchReviewVotes);
reviewsRouter.route('/').get(getReviews).post(postReview);

module.exports = reviewsRouter;