const express = require('express');
const fileReader = require('./fileHandling/fileReader');
const fileWriter = require('./fileHandling/fileWriter');
const tokenValidation = require('./validation/tokenValidation');

const postLoginValidation = require('./validation/postLoginValidation');
const nameTalkerValidarion = require('./validation/nameTalkerValidarion');
const ageTalkerValidarion = require('./validation/ageTalkerValidarion');
const talkTalkerValidarion = require('./validation/talkTalkerValidarion');
const rateTalkerValidation = require('./validation/rateTalkerValidation');
const searchBy = require('./utils/searchBy');
const validateDateFormatAndRate = require('./validation/validateDateFormatAndRate');
const isRateValid = require('./utils/isRateValid');

const getTalkersFromDB = require('./db/getTalkersFromDB');

const talkerJSON = 'src/talker.json';

const message1 = { message: 'O campo "rate" é obrigatório' };
const message2 = { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/db', async (_req, res) => {
  try {
    const data = await getTalkersFromDB();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao ler o arquivo de talkers.');
  }
});

app.patch('/talker/rate/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  if (rate === undefined) return res.status(400).json(message1);
  if (!isRateValid(rate)) return res.status(400).json(message2);
  try {
    const data = await fileReader(talkerJSON);
    const talkerById = data.find((talker) => talker.id === Number(id));
    const newTalker = { ...talkerById, talk: { ...talkerById.talk, rate } };
    const talkersUpdated = data.map((talker) => (talker.id === Number(id) ? newTalker : talker));
    await fileWriter(talkerJSON, JSON.stringify(talkersUpdated, null, 2));
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao ler o arquivo de talkers.');
  }
});

app.get('/talker/search', tokenValidation, validateDateFormatAndRate, async (req, res) => {
  const { q, rate, date } = req.query;

  if (rate && !isRateValid(rate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  
  try {
    const data = await fileReader(talkerJSON);
    const result = await searchBy(res, { q, rate, date, data });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao ler o arquivo de talkers.');
  }
});

app.get('/talker', async (_req, res) => {
  const readFile = await fileReader(talkerJSON);
  return res.status(200).json(readFile);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const readFile = await fileReader(talkerJSON);

  const talker = readFile.find((talk) => talk.id === Number(id));

  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(talker);
});

app.post('/login', postLoginValidation, async (_req, res) => {
  // const login = req.body;

  // Geração do token:
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const length = 16;
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  // const readFile = await fileReader('src/authorization.json');
  // readFile.push({ token });
  // fileWriter('src/authorization.json', JSON.stringify(readFile, null, 2));

  res.status(200).json({ token });
});

app.use(tokenValidation);

app.post(
  '/talker',
  nameTalkerValidarion,
  ageTalkerValidarion,
  talkTalkerValidarion,
  rateTalkerValidation,
  async (req, res) => {
    const readFile = await fileReader(talkerJSON);
    const { name, age, talk } = req.body;
    const id = readFile.length + 1;

    readFile.push({ name, age, id, talk });

    fileWriter(talkerJSON, JSON.stringify(readFile, null, 2));

    res.status(201).json({ name, age, id, talk });
},
);

app.put(
  '/talker/:id',
  nameTalkerValidarion,
  ageTalkerValidarion,
  talkTalkerValidarion,
  rateTalkerValidation,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;

    const readFile = await fileReader(talkerJSON);

    const talker = readFile.find((t) => t.id === Number(id));

    if (!talker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    const newTalker = { name, age, id: Number(id), talk };

    const talkersUpdated = readFile.filter((tal) => tal.id !== Number(id));

    await fileWriter(talkerJSON, JSON.stringify([...talkersUpdated, newTalker], null, 2));

    return res.status(200).json(newTalker);
  },
);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const readFile = await fileReader(talkerJSON);

  const newreadFile = readFile.filter((talker) => talker.id !== Number(id));

  await fileWriter(talkerJSON, JSON.stringify(newreadFile, null, 2));

  return res.status(204).end();
});

// app.get('/talker/search', rateTalkerValidation, async (req, res) => {
//   const { q, rate } = req.query;
  
//   try {
//     const data = await fileReader(talkerJSON);
//     const result = await searchBy(q, rate, data);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Erro ao ler o arquivo de talkers.');
//   }
// });
