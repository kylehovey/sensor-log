const express = require('express');
const bodyParser = require('body-parser');
const api = require('./app_modules/express/routes/api');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const serialPath = '/dev/serial/by-id/usb-Arduino_LLC_Arduino_Leonardo-if00';
const serialPort = new SerialPort(serialPath, { baudRate: 9600 });

const parser = new Readline();
serialPort.pipe(parser);

parser.on('data', data => {
  io.emit('data-point', JSON.parse(data));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);

/* eslint-disable-next-line no-console */
server.listen(port, () => console.log(`Listening on port ${port}`));
