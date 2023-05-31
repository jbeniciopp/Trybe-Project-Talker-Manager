const dateValidation = (date) => {
  const padrao = /^\d{2}\/\d{2}\/\d{4}$/; // Expressão regular para o formato dd/mm/aaaa
  if (padrao.test(date)) {
      return true;
  } 
      return false;
};

const talkTalkerValidarion = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  const { watchedAt } = talk;
    
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  } if (dateValidation(watchedAt) === false) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

module.exports = talkTalkerValidarion;
