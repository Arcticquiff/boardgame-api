const db = require('../connection.js');
const { formatCategories, formatUsers, formatReviews, formatComments } = require('../utils/data-manipulation.js');
const format = require('pg-format');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  //Deletes all tables from database
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS reviews;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS categories;');
  // console.log('Tables deleted');

  //Creates new tables
  await db.query(`CREATE TABLE categories (
      slug VARCHAR(2000) PRIMARY KEY,
      description TEXT NOT NULL
      );`);
  await db.query(`CREATE TABLE users (
      username VARCHAR(2000) PRIMARY KEY,
      avatar_url VARCHAR(2000) NOT NULL,
      name VARCHAR(2000) NOT NULL
      );`);
  await db.query(`CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(2000) NOT NULL,
      review_body VARCHAR(2000) NOT NULL,
      designer VARCHAR(2000) NOT NULL,
      review_img_url VARCHAR(2000) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      category VARCHAR(2000) REFERENCES categories(slug) NOT NULL,
      owner VARCHAR(2000) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );`);
  await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(2000) REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      body VARCHAR(2000) NOT NULL
    )`);
  // console.log('Tables created');

  //Inserts formatted category data into category table
  await db.query(format(
    `INSERT INTO categories 
        (slug, description)
        VALUES %L RETURNING *;`, formatCategories(categoryData)));

  //Inserts formatted user data into user table
  await db.query(format(
    `INSERT INTO users
        (username, avatar_url, name)
        VALUES %L RETURNING *;`, formatUsers(userData)));

  //Inserts formatted review data into reviews table
  const instertedReviews = await db.query(format(
    `INSERT INTO reviews
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L RETURNING *;`, formatReviews(reviewData)));

  //Inserts formatted comment data into comments table
  await db.query(format(
    `INSERT INTO comments
        (author, review_id, votes, created_at, body)
        VALUES %L RETURNING *;`, formatComments(commentData, instertedReviews.rows)));
  // console.log('Inserted data into tables');
};

module.exports = seed;
