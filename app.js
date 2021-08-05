const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const { incorrectPath, customErr, fiveHundErr } = require("./MVC/errors")

app.use(express.json());
app.use('/api', apiRouter);
app.use(customErr);
app.use('*', incorrectPath);

app.use(fiveHundErr);

module.exports = app;