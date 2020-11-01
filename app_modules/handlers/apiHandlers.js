module.exports = {
  allData: async ({ SensorPoint }) => {
    return SensorPoint.read();
  },
  current: ({ recent }) => recent,
};
