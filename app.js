const cors = require('cors');
const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const { incorrectPath, customErr, fiveHundErr } = require("./MVC/errors")

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.use(customErr);
app.use('*', incorrectPath);

app.use(fiveHundErr);

module.exports = app;