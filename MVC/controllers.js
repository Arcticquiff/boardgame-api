const { selectCategories, selectReview, updateReviewVotes, selectReviews, selectReviewComments, insertComment, selectEndpoints, removeComment } = require('./models');

exports.getEndpoints = (req, res, next) => {
    return res.send({ endpoints: selectEndpoints() });
};
exports.getCategories = (req, res, next) => {
    return selectCategories().then(categories => {
        res.send({ categories });
    }).catch(err => next(err));
};
exports.getReview = (req, res, next) => {
    return selectReview(req.params.review_id).then(review => {
        res.send({ review });
    }).catch(err => next(err));
};
exports.getReviews = (req, res, next) => {
    return selectReviews(req.query).then(reviews => {
        res.send({ reviews: reviews.reviews, total_count: reviews.totalcount });
    }).catch(err => next(err));
};
exports.getReviewComments = (req, res, next) => {
    return selectReviewComments(req.params.review_id).then(comments => {
        res.send({ comments });
    }).catch(err => next(err));
};
exports.patchReviewVotes = (req, res, next) => {
    return updateReviewVotes(req.params.review_id, req.body).then(updatedReview => {
        res.status(201).send({ updatedReview });
    }).catch(err => next(err));
};
exports.postComment = (req, res, next) => {
    return insertComment(req.params.review_id, req.body).then(comment => {
        res.status(201).send({ comment });
    }).catch(err => next(err));
};
exports.deleteComment = (req, res, next) => {
    return removeComment(req.params.comment_id).then(() => {
        res.status(204).send();
    }).catch(err => next(err));
};