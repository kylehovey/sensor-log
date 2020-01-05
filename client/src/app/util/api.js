import { postRequest, getRequest } from './requests';

/**
 * When importing, just import the name of the command you want
 * as it is seen in this object. I export a transformed version
 * of this where what is stored at each key is a function that
 * does the fetch logic. Example:
 *
 * import api from './util/api';
 *
 * api.createQuiz('My Quiz').then(console.log("Created!"));
 *
 * or
 *
 * const quiz = await api.createQuiz('My Quiz');
 *
 * Feel free to define more. Just follow the same pattern you
 * see in the rest of the objects and the builder at the end of
 * the file will take care of the rest.
 */
const commands = {
  basicRequest: {
    method: 'GET',
    command: 'basicRequest',
    genData: (name) => ({ name })
  }
};

const unwrap = req => req
  .then(res => res.json())
  .then(({ response }) => response);

export default Object
  .entries(commands)
  .reduce((api, [key, { method, command, genData }]) => ({
    ...api,
    [key]: (...commandArgs) => ({
      GET: (...args) => unwrap(getRequest(...args)),
      POST: (...args) => unwrap(postRequest(...args))
    })[method]('/api?', command, genData(...commandArgs))
  }), { });
