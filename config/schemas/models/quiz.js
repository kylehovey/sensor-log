const shortString = { type: 'string', minLength: 0, maxLength: 100 };
const userType =  { ...shortString, maxLength: 20 };
const urlType = { type: 'string' };
const responseType = {
  oneOf: [
    { type: 'number', multipleOf: 1, minimum: 0 },
    { type: 'null' }
  ]
};
const questionItemType = {
  type: 'object',
  properties: {
    question: {
      oneOf: [
        { type: 'null'},
        { ...shortString }
      ]
    },
    answers: { minItems: 1, maxItems: 100 },
    responses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user: { ...userType },
          response: { ...responseType }
        },
        required: ['user', 'response']
      }
    },
    correct: {
      type: 'array',
      items: { ...responseType }
    }
  },
  required: ['question', 'responses', 'answers', 'correct'],
  additionalProperties: false
};

module.exports =  {
  name: 'quiz',
  schema : {
    type: 'object',
    properties: {
      title: { type: 'string', ...shortString },
      status: {
        type: 'string',
        enum: ['UNSTARTED', 'STARTED', 'STOPPED']
      },
      activeQuestion: { type: 'number', multipleOf: 1, min: -1 },
      urls: {
        type: 'object',
        properties: {
          view: { ...urlType },
          edit: { ...urlType }
        },
        required: ['view', 'edit'],
        additionalProperties: false
      },
      users: {
        type: 'array',
        items: {
          ...userType
        }
      },
      questions: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: { ...questionItemType }
      }
    },
    required: [
      'title',
      'status',
      'activeQuestion',
      'urls',
      'users',
      'questions'
    ],
    additionalProperties: false
  },
  id: ({ title }) => title,
  rasa : {
    title: 'Quiz',
    status: 'UNSTARTED',
    activeQuestion: 0,
    urls: {
      edit: 'an4fDetAn1',
      view: '4LniA1ngec'
    },
    users: [
      'Dirk Gently',
      'Arthur Dent'
    ],
    questions: [
      {
        question: 'What is the answer to life, the universe, and everything?',
        answers: [
          'Fluffy Puppies',
          '42',
          'Videogames and Coffee',
          'Memes'
        ],
        responses: [
          {
            user: 'Dirk Gently',
            response: 0
          },
          {
            user: 'Arthur Dent',
            response: null
          }
        ],
        correct: [1]
      },{
        question: 'What is the ultimate question?',
        answers: [
          'How many roads must a man walk down?',
          'What is 6 times 7?',
          'What is Love?',
          'What are hands?'
        ],
        responses: [
          {
            user: 'Dirk Gently',
            response: 1
          },
          {
            user: 'Arthur Dent',
            response: 2
          }
        ],
        correct: [2]
      }
    ]
  }
};
