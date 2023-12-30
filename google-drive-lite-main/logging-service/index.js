require('dotenv').config();
const express = require('express');

const logs_router = require('./logs');

const app = express();

app.use('/logs', logs_router);

app.get('/*', (req, res) => {
    res.status(404).send({"error": "The requested resouce couldn't be found."});
})

app.listen(process.env.PORT, () => {
    console.log(`This server is now listening on port ${process.env.PORT}. Go give it a whirl!`);
})