exports.formatCategory = (categories) => {
    return categories.map(category => {
        return [category.slug, category.description];
    });
};
