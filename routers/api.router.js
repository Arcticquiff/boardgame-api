const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router');

apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;