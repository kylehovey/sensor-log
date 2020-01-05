module.exports =  {
  name: 'testDB',
  schema : {
    type: 'object',
    properties: {
      x: {
        type: 'number',
        minimum: 0,
        maximum: 100
      },
      y: {
        type: 'string'
      }
    },
    required: ['x', 'y'],
    additionalProperties: false
  },
  id: ({ x }) => x,
  rasa : { x: 42, y: 'holistic' }
};
