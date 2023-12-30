const express = require('express');
const logs_router = express.Router();
const Logs = require("./config/db")

logs_router.use(express.json());

logs_router.route('/')
 .post(async (req, res) => {
    let time = new Date(req.body.time);
    let service = req.body.service;
    let message = req.body.message;
    let size = req.body.size;

    await Logs.create({time: time,size:size, service: service, message: message});
    res.status(200).end();
 });

module.exports = logs_router;