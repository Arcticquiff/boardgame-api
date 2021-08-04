const db = require('./db/connection');
process.env.NODE_ENV = 'test';
const func = async () => {
    return await db.query(`SELECT title FROM reviews WHERE category = 'undefined'`)
};
func().then((ans) => {
    console.log(ans.rows)
}).then(() => {
    db.end();
});