require('dotenv').config();
const express = require('express');

const logs_router = require('./logs');

const app = express();
const port = process.env.PORT || 8080;

app.use('/logs', logs_router);

app.get('/*', (req, res) => {
    res.status(404).send({"error": "The requested resource couldn't be found."});
});

app.listen(port, () => {
    console.log(`This server is now listening on port ${port}. Go give it a whirl!`);
});
