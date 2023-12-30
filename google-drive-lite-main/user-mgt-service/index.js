require('dotenv').config();
const express = require('express');
const cors = require('cors');

const user_router = require('./users');

const app = express();

app.use('/users', cors(), user_router);

const port = process.env.PORT || 8080;

app.get('/*', (req, res) => {
    res.status(404).send({"error": "The requested resource couldn't be found."});
});

app.listen(port, () => {
    console.log(This server is now listening on port ${port}. Go give it a whirl!);
});
