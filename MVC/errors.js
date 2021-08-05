exports.incorrectPath = (req, res, next) => {
    res.status(400).send({ message: 'incorrect path' });
};
exports.customErr = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else if (err.code === '23503') {
        res.status(404).send({ message: 'review not found' });
    } else if (err.code === '23502') {
        res.status(400).send({ message: 'bad request' });
    }
    else next(err);
};
exports.fiveHundErr = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'something went wrong' });
};