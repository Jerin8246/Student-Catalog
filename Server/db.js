const Pool =  require("pg").Pool;


const pool = new Pool({
    user: "jerinjoseph",
    host: "localhost",
    port: 8888,
    database: "studentcat"
});

module.exports = pool;