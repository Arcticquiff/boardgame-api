const categoriesRouter = require('../routers/categories.router');
const { selectCategories, selectReview } = require('./models');


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
