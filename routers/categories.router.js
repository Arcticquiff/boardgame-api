const categoriesRouter = require('express').Router();
const { getCategories } = require('../MVC/controllers');

categoriesRouter.route('/').get(getCategories)

module.exports = categoriesRouter;