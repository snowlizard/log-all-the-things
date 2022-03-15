const express = require('express');
const fs = require('fs');
const moment = require('moment');

const app = express();

app.use((req, res, next) => {
// write your logging code here
    const log = {
        "Agent"       : req.headers['user-agent'],
        "Time"        : moment().format('YYYYMMDD'),
        "Method"      : req.method,
        "Resource"    : req.originalUrl,
        "Status"      : res.statusCode,
        "Version" : 'HTTP/' + req.httpVersion,
    };
    
    // write to log
    fs.appendFile('./server/log.csv', JSON.stringify(log) + ',', () => {
        console.log('data written to log.');
    });

    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    const log = [
        req.headers['user-agent'],
        moment().format('YYYYMMDD'),
        req.method,
        req.originalUrl,
        'HTTP/' + req.httpVersion,
        res.statusCode,
    ];
    res.status(200).send('ok');
    console.log('OK ' + log);
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    const data = (fs.readFileSync('./server/log.csv', 'utf-8'));
    const logs = `[${data.toString().substring(0, data.length - 1)}]`;
    res.send(JSON.parse(logs.split(',')));
});

module.exports = app;
