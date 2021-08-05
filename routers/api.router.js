const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router');
const { getEndpoints } = require('../MVC/controllers');

apiRouter.route('/').get(getEndpoints)
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;