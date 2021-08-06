const commentsRouter = require('express').Router();
const { deleteComment, patchComment } = require('../MVC/controllers');

commentsRouter.route('/:comment_id').delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;