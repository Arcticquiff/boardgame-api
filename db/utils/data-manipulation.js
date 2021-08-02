const db = require('../connection');
const comments = require('../data/test-data/comments');
const reviews = require('../data/test-data/reviews');

exports.formatCategories = (categories) => {
    return categories.map(category => {
        return [category.slug, category.description];
    });
};

exports.formatUsers = (users) => {
    return users.map(user => {
        return [user.username, user.avatar_url, user.name];
    });
};

exports.formatReviews = (reviews) => {
    return reviews.map(review => {
        return [review.title, review.designer, review.owner, review.review_img_url, review.review_body, review.category, review.created_at, review.votes];
    });
};

exports.formatComments = (comments, reviews) => {
    const refObj = {};
    reviews.forEach(review => {
        refObj[review.title] = review.review_id;
    });
    return comments.map(comment => {
        return [comment.created_by, refObj[comment.belongs_to], comment.votes, comment.created_at, comment.body]
    });

};