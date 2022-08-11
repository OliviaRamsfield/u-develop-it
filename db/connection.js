//imports
const mysql = require('mysql2');

//connect to SQL database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        //mysql  username
        user: 'root',
        //mysql password
        password: 'auri',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

//exports
module.exports = db;