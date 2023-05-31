const connection = require('./connections');

const getTalkersFromDB = async () => {
  const [rows] = await connection.execute('SELECT * FROM talkers;');
  const talkers = rows.map((talker) => ({
    id: talker.id,
    name: talker.name,
    age: talker.age,
    talk: {
      watchedAt: talker.talk_watched_at,
      rate: talker.talk_rate,
    },
  }));
  return talkers;
};

module.exports = getTalkersFromDB;