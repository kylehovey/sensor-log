const express = require('express');
const bodyParser = require('body-parser');

const ModelStore = require('./app_modules/models/model.js');
const config = require('./config/schemas/models/sensorPoint.js');
const api = require('./app_modules/express/routes/api');

const SensorPoint = new ModelStore(config);

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

const when = ([key]) => fn => (inst, point) => inst === key ? fn(point) : point;
const displayAs = ([unit]) => () => ({ unit });

const rules = [
  when`pm10`(displayAs`µg/m³`),
  when`pm25`(displayAs`µg/m³`),
  when`pm100`(displayAs`µg/m³`),
  when`CO2`(displayAs`Parts Per Million`),
  when`TVOC`(displayAs`Parts Per Billion`),
  when`pressure`(({ unit, value }) => ({
    unit: 'Atmospheres',
    value: (value * 0.00000987).toFixed(2),
  })),
  when`temperature`(({ unit, value }) => ({
    unit: '°F',
    value: (value * 9/5 + 32).toFixed(2),
  })),
];

const chain = rules
  .reduce((acc, fn) => (key, point) => fn(key, acc(key, point)), (a, b) => b);

const transform = (data) => Object
  .entries(data)
  .reduce((acc, [key, point]) => ({
    ...acc,
    [key]: {
      ...point,
      ...chain(key, point),
    },
  }), {});

const extras = [
];

parser.on('data', data => {
  const parsed = JSON.parse(data);

  SensorPoint.create(parsed)

  io.emit('data-point', {
    ...transform(parsed),
    ...extras.reduce((acc, fn) => ({
      ...acc,
      ...fn(parsed),
    }), {})
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);

/* eslint-disable-next-line no-console */
server.listen(port, () => console.log(`Listening on port ${port}`));
