exports.incorrectPath = (req, res, next) => {
    res.status(400).send({ message: 'incorrect path' });
};
exports.customErr = (err, req, res, next) => {
    res.status(err.status).send({ message: err.message });
};