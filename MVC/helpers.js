const categories = require("../db/data/test-data/categories");

exports.validateReviewQueries = (queries) => {
    const { sort_by, order_by, category } = queries;
    if (!['owner', 'title', 'review_id', 'category', 'review_img_url', 'created_at', 'votes', 'comment_count', undefined].includes(sort_by) ||
        !['ASC', 'DESC', undefined].includes(order_by)) return false;
    return true;
};
exports.validatePagination = (queries) => {
    const { limit = '0', page = '0' } = queries;
    if (!limit.match(/^[0-9]+$/g)) return false;
    if (!page.match(/^[0-9]+$/g)) return false;
    return true;
};
exports.validateCategory = (queries) => {
    const { category } = queries;
    if (!['strategy', 'hidden-roles', 'dexterity', 'push-your-luck', 'roll-and-write', 'deck-building', 'engine-building', 'social deduction', undefined].includes(category)) return false;
    return true;
};