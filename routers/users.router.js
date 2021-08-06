const usersRouter = require('express').Router();
const { getUsers, getUser } = require('../MVC/controllers');

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getUser);

module.exports = usersRouter;