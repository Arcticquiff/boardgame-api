const db = require('../connection.js');
const { formatCategory } = require('../utils/data-manipulation.js');
const format = require('pg-format');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  //Deletes all tables from database
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS reviews;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS categories;');
  console.log('Tables deleted');

  //Creates new tables
  await db.query(`CREATE TABLE categories (
      slug VARCHAR(100) PRIMARY KEY,
      description TEXT NOT NULL
      );`);
  await db.query(`CREATE TABLE users (
      username VARCHAR(30) PRIMARY KEY,
      avatar_url TEXT,
      name VARCHAR(40) NOT NULL
      );`);
  await db.query(`CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(40) NOT NULL,
      review_body VARCHAR(350) NOT NULL,
      review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      catagory TEXT REFERENCES categories(slug) NOT NULL,
      owner VARCHAR(30) REFERENCES users(username) NOT NULL,
      created_at VARCHAR(20) DEFAULT CURRENT_TIMESTAMP
      );`);
  await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(30) REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) NOT NULL,
      votes INT DEFAULT 0,
      created_at VARCHAR(20) DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    )`);
  console.log('Tables created');

  //Inserts formatted category data into category table
  const insertedCategories = await db.query(format(
    `INSERT INTO categories 
        (slug, description)
        VALUES %L RETURNING *;`, formatCategory(categoryData)));
  console.log('Inserted data into categories');
};

module.exports = seed;
