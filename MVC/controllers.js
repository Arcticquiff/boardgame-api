const categoriesRouter = require('../routers/categories.router');
const { selectCategories } = require('./models');

exports.getCategories = (req, res) => {
    return selectCategories().then(categories => {
        res.send({ categories });
    });
};