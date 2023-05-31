const { filterByName, filterByRate, filterByDate } = require('./filterBy');

const filterByAll = ({ q, rate, date, data }) => {
  let result = data;
  if (q) result = filterByName(result, q);
  if (rate) result = filterByRate(result, rate);
  if (date) result = filterByDate(result, date);
  return result;
};

const searchBy = async (_, { q, rate, date, data }) => {
  if (!q && !rate && !date) {
    return data;
  }
  return filterByAll({ q, rate, date, data });
};

module.exports = searchBy;