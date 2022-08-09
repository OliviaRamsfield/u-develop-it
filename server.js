//imports
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

//get all candidates in table
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

//get a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err)
//     }
//     console.log(row)
// });

//delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, row) => {
//     if (err) {
//         console.log(err)
//     }
//     console.log(row)
// });

//add a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err)
//     }
//     console.log(result)
// });

//default response for any other request (NOT FOUND) - must come after all other routes
app.use((req, res) => {
    res.status(404).end()
});

//start express server and must stay on bottom
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});