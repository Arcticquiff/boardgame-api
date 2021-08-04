const { selectCategories, selectReview, updateReviewVotes, selectReviews } = require('./models');

exports.getCategories = (req, res) => {
    return selectCategories().then(categories => {
        res.send({ categories });
    });
};
exports.getReview = (req, res, next) => {
    return selectReview(req.params.review_id).then(review => {
        res.send({ review });
    }).catch(err => next(err));
};
exports.getReviews = (req, res, next) => {
    return selectReviews(req.query).then(reviews => {
        res.send({ reviews });
    }).catch(err => next(err));
};
exports.postReviewVotes = (req, res, next) => {
    return updateReviewVotes(req.params.review_id, req.body.inc_votes).then(updatedReview => {
        res.status(201).send({ updatedReview });
    }).catch(err => next(err));
};