const reviewsRouter = require('express').Router();
const { getReview } = require('../MVC/controllers');

reviewsRouter.route('/:review_id').get(getReview);

module.exports = reviewsRouter;