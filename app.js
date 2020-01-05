const express = require('express');
const bodyParser = require('body-parser');
const api = require('./app_modules/express/routes/api');

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);


/* eslint-disable-next-line no-console */
server.listen(port, () => console.log(`Listening on port ${port}`));
