const nedb = require('nedb');
const Ajv = require('ajv');
const ajv = new Ajv();
const { path, options } = require('../../config/db.js');

/**
 * This is an abstract CRUD model type that persists itself
 * in a store.
 */
module.exports = class ModelStore {
  /**
   * Instantiate the model
   * @param {Object} opts Config options
   * @param {String} opts.name Store name (identifies store)
   * @param {Object} opts.schema JSON Schema for elements in store
   *  Example: { type: 'object', properties: { x: { type: 'number' } } }
   * @param {Object} opts.rasa Default object (when writing a new value
   *  this will specify defaults) Example: { x: 100 }
   * @param {Function} opts.id Given valid data, extract the id for that data
   */
  constructor(opts) {
    const { name, schema, id, rasa } = opts;
    this._validate = ajv.compile(schema);
    this._id = id;
    this._rasa = rasa;
    this._db = new nedb({
      filename: `${path}/${name}`,
      ...options
    });
  }

  /**
   * Validate options against the schema
   * @param {Object} opts Configuration options for model
   * @return {Promise} Resolves if valid, rejects with error
   *  text if not valid
   */
  validate(opts) {
    return new Promise((resolve, reject) => {
      const valid = this._validate(opts);

      if (!valid) {
        const [{ message, dataPath, schemaPath }] = this._validate.errors;
        reject(`Object${dataPath} ${message} (@${schemaPath}).`);
      }

      resolve();
    });
  }

  /**
   * Add a type to the store
   * @param {Object} opts Configuration options for model
   * @return {Promise} Resolves if inserted, rejects if it was not
   */
  create(opts) {
    const obj = { ...this._rasa, ...opts };
    return this
      .validate(obj)
      .then(() => new Promise((resolve, reject) => {
        this._db.insert({ _id: this._id(obj), ...obj }, err => {
          if (err !== null) {
            reject(err);
          }

          resolve();
        });
      }));
  }

  /**
   * Get a model from the store
   * @param {Object} opts Configuration options for model
   * @return {Promise} Resolves to model, rejects if not found/error
   */
  read(query = {}) {
    return new Promise((resolve, reject) => {
      this._db.find(query, (err, docs) => {
        if (err !== null) {
          reject(err);
        }

        resolve(docs);
      });
    });
  }

  /**
   * Update a model in the store
   * @param {Object} query Query for models to be updated
   * @param {Object} opts Options to update in model (can
   *  be subset of total options)
   * @return {Promise}
   */
  update(query, opts) {
    return this
      .validate({ ...this._rasa, ...opts })
      .then(() => new Promise((resolve, reject) => {
        this._db.update(query, { $set: opts }, err => {
          if (err !== null) {
            reject(err);
          }

          resolve();
        });
      }));
  }

  /**
   * Remove a model(s) from the store
   * @param {Object} query Query for models to be deleted
   * @return {Promise} Resolves to number of deleted documents,
   *  rejects if error or if none deleted
   */
  remove(query) {
    return new Promise((resolve, reject) => {
      this._db.remove(query, (err, numRemoved) => {
        if (err !== null || numRemoved === 0) {
          reject(numRemoved > 0 ? err : 'Nothing found to remove.');
        }

        resolve(numRemoved);
      });
    });
  }
};
