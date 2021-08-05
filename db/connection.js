const { Pool } = require('pg');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

const config =
  ENV === 'production' ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false, },
  } : {};

require('dotenv').config({
  path: path.resolve(__dirname, `../envFiles/.env.${ENV}`),
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
};

module.exports = new Pool(config);
