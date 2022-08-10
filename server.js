//imports
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { restoreDefaultPrompts } = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    });
});

//get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id]

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'success',
            data: row
        })
    });
});


//delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`
    const params = [req.params.id]

db.query(sql, params, (err, result) => {
    if (err) {
        res.statusMessage(400).json({ error: err.message })
    } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate not found.'
        })
    } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
            })
        }
    });
});

//add a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if (errors) {
        res.status(400).json({ error: errors })
        return
    }
const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
            VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];

db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message })
        return
    }
    res.json({
        message: 'success',
        data: body
    })
});
});

//update candidate party affiliation
app.put('/api/candidate/:id', (req, res) => {
    //make sure there is a party id was provided before trying to use the database
    const errors = inputCheck(req.body, 'party_id')

    if (errors) {
        res.status(400).json({ error: errors })
        return
    }

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            //check if a record was found below:
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            })
        }
    });
});

//get all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({
            message: 'success',
            data: rows
        })
    });
});

//get single party
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id]
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'success',
            data: row
        })
    });
});

//delete from parties
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id]
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message })
            //checks if anything was deleted below:
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            })
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        }
    });
});


//default response for any other request (NOT FOUND) - must come after all other routes
app.use((req, res) => {
    res.status(404).end()
});

//start express server and must stay on bottom
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});