const filterByName = (data, q) => data.filter((talker) => talker.name.includes(q));

const filterByRate = (data, rate) => data.filter(({ talk }) => talk.rate === Number(rate));

const filterByDate = (data, date) => data.filter((talker) => talker.talk.watchedAt.includes(date));

module.exports = {
  filterByName,
  filterByRate,
  filterByDate,
};