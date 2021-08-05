const commentsRouter = require('express').Router();
const { deleteComment } = require('../MVC/controllers');

commentsRouter.route('/:comment_id').delete(deleteComment);

module.exports = commentsRouter;