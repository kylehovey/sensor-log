const express = require('express');
const Ajv = require('ajv');
const router = express.Router();

const ajv = new Ajv();
const {
  basicRequest
} = require('../../handlers/apiHandlers.js');

/**
 * Check out https://json-schema.org/understanding-json-schema/ for how
 * to build a schema
 */
const commands = {
  POST: {
  },
  GET: {
    basicRequest: {
      genArgs: ({ name }) => [name],
      handler: basicRequest,
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name'],
        additionalProperties: false
      }
    }
  }
};

['POST', 'GET'].forEach(method => {
  Object
    .entries(commands[method])
    .forEach(([key, { schema }]) => {
      commands[method][key]['validate'] = ajv.compile(schema);
    });
});

router.all('/', (req, res) => {
  const { method } = req;
  const request = {
    ...{ command: 'none', data: '{}' },
    ...req.body,
    ...req.query
  };
  const { command, data: rawData } = request;

  let data;

  try {
    if (typeof rawData === 'object') {
      data = rawData;
    } else {
      data = JSON.parse(rawData);
    }
  } catch (err) {
    res.status(400).json({
      error: 'Malformed request.data object sent. Must be JSON.',
      request
    });
  }

  /* eslint-disable-next-line no-console */
  console.log(
    `Recieved ${method} request: ${command}(${JSON.stringify(data)})`
  );

  if (method in commands && command in commands[method]) {
    const { genArgs, handler, validate } = commands[method][command];

    if (validate(data)) {
      Promise.resolve(
        handler(res.locals, ...genArgs(data))
      ).then(ret => {
        res.json({ response: ret });
      }).catch(error => {
        const dataStr = JSON.stringify(data, null, 2);
        /* eslint-disable-next-line no-console */
        console.error(
          `${error} - Failed to ${command} with ${dataStr}`
        );

        res.status(500).json({ error, request });
      });
    } else {
      const [{ message, dataPath }] = validate.errors;
      /* eslint-disable-next-line no-console */
      console.error(message, 
        `invalid data - ${command} with ${JSON.stringify(data)}`
      );
      
      res.status(500).json({
        error: `Object${dataPath} ${message}.`,
        request
      });
    }
  } else {
    res.status(400).json({ error: `command "${command}" not found` });

    /* eslint-disable-next-line no-console */
    console.error(`Error: command "${command}" not found`);
  }
});

module.exports = router;
