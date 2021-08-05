const usersRouter = require('express').Router();
const { getUsers } = require('../MVC/controllers');

usersRouter.route('/').get(getUsers);

module.exports = usersRouter;