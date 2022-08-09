//imports
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//default response for any other request (NOT FOUND) - must come after all other routes
app.use((req, res) => {
    res.status(404).end()
});

//start express server and must stay on bottom
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});