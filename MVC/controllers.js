const { selectCategories, selectReview, updateReviewVotes, selectReviews, selectReviewComments, insertComment, selectEndpoints, removeComment, selectUsers, selectUser, updateCommentVotes, insertReview } = require('./models');

exports.getEndpoints = (req, res, next) => {
    res.send({ endpoints: selectEndpoints() });
};
exports.getUsers = (req, res, next) => {
    return selectUsers().then(users => {
        res.send({ users });
    }).catch(err => next(err));
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
    return selectReviewComments(req.params.review_id, req.query).then(comments => {
        res.send({ comments });
    }).catch(err => next(err));
};
exports.getUser = (req, res, next) => {
    return selectUser(req.params.username).then(user => {
        res.send({ user });
    }).catch(err => next(err))
};
exports.patchReviewVotes = (req, res, next) => {
    return updateReviewVotes(req.params.review_id, req.body).then(updatedReview => {
        res.status(201).send({ updatedReview });
    }).catch(err => next(err));
};
exports.postReview = (req, res, next) => {
    return insertReview(req.body).then(review => {
        res.status(201).send({ review });
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
exports.patchComment = (req, res, next) => {
    return updateCommentVotes(req.params.comment_id, req.body).then(comment => {
        res.status(201).send({ comment });
    }).catch(err => next(err));
};