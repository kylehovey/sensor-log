const fs = require('fs');
const ModelStore = require('../../app_modules/models/model.js');
const config = require('../../config/schemas/models/modelTest.js');
const { name } = config;

async function deleteDB() {
  await new Promise(resolve => fs.unlink(`db/${name}`, resolve));
}

describe('ModelStore', () => {
  it('Can read an element in the database', async () => {
    expect.assertions(1);

    await deleteDB();
    const store = new ModelStore(config);
    await store.create({ x: 21, y: 'holistic' });

    expect(await store.read()).toEqual([{ _id: 21, x: 21, y: 'holistic' }]);
  });

  it('Correctly assigns defaults', async () => {
    expect.assertions(1);

    await deleteDB();
    const store = new ModelStore(config);
    await store.create({ });

    expect(await store.read()).toEqual([{ _id: 42, x: 42, y: 'holistic' }]);
  });

  it('Can add an element to the database', async () => {
    expect.assertions(1);

    await deleteDB();
    const store = new ModelStore(config);
    await store.create({ x: 21, y: 'thing' });

    expect(await store.read()).toEqual([{ _id: 21, x: 21, y: 'thing' }]);
  });

  it('Can remove an element from the database', async () => {
    expect.assertions(2);

    await deleteDB();
    const store = new ModelStore(config);
    await store.create({ x: 21 });
    await store.create({ x: 30 });
    const nRemoved = await store.remove({ x: 30 });

    expect(nRemoved).toBe(1);
    expect(await store.read()).toEqual([{ _id: 21, x: 21, y: 'holistic' }]);
  });

  it('Can update an element in the database', async () => {
    expect.assertions(2);

    await deleteDB();
    const store = new ModelStore(config);
    await store.create({ x: 21 });

    expect(await store.read()).toEqual([{ _id: 21, x: 21, y: 'holistic' }]);

    await store.update({ x: 21 }, { y: 'fish' });

    expect(await store.read()).toEqual([{ _id: 21, x: 21, y: 'fish' }]);
  });
});
