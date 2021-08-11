exports.incorrectPath = (req, res, next) => {
    res.status(400).send({ message: 'invalid path' });
};
exports.customErr = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else if (err.code === '23503') {
        res.status(404).send({ message: err.message });
    } else if (err.code === '23502' || err.code === '22P02' || err.code === '23505') {
        res.status(400).send({ message: 'missing or invalid value' });
    }
    else next(err);
};
exports.fiveHundErr = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'something went wrong' });
};