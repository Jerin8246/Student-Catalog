const Pool =  require("pg").Pool;


const pool = new Pool({
    user: "jerinjoseph",
    host: "localhost",
    port: 8888,
    database: "student2"
});

module.exports = pool;