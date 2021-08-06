# Welcome to my board game review API!

https://tp-boardgame-api.herokuapp.com/

This project is a fairly straight-forward look at a database API, feel free to have a look around!

This project was made on node version:
> 16.5.0

and Postgres version:
> 7.19.1

---
## Setup

---
### Dependencies:

You will need the following node packages:

- Jest
> npm i jest -D
- Supertest
> npm i supertest -D
- dotenv
> npm i dotenv
- express
> npm i express
- postgresql
> npm i pg
- pg-format
> npm i pg-format 
---
### Initialising the database
Inside the 'envFiles' folder you will need to create two files:
> .env.development

> .env.test

thes files will determine which database (test or development) you are connected to, inside these files will need to be the following:
> PGDATABASE=your_database_here

> PGDATABASE=your_database_here_test

Next run these commands next to setup the databases:

> npm run setup-dbs

> npm run seed

and your database should be seeded with the test data.

to run tests on the test data type the following command:
> npm t app

---