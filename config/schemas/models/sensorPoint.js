const Reading = ({ min, max }) => ({
  type: 'object',
  properties: {
    value: {
      type: 'number',
      minimum: min,
      maximum: max,
    },
    unit: {
      type: 'string',
      minLength: 0,
      maxLength: 20,
    },
  },
  required: ['value', 'unit'],
  additionalProperties: false,
});

module.exports =  {
  name: 'SensorPoints',
  schema : {
    type: 'object',
    properties: {
      CO2: Reading({
        min: 400,
        max: 8192,
      }),
      TVOC: Reading({
        min: 0,
        max: 1187,
      }),
      temperature: Reading({
        min: -40,
        max: 85,
      }),
      pressure: Reading({
        min: 30e3,
        max: 110e3,
      }),
      humidity: Reading({
        min: 0,
        max: 100,
      }),
    },
    required: ['CO2', 'TVOC', 'temperature', 'pressure', 'humidity'],
    additionalProperties: false
  },
  id: () => +(new Date),
  rasa : { },
};
