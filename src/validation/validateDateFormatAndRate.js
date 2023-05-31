const message1 = { message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' };
const message2 = { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' };
const isRateValid = require('../utils/isRateValid');

const validateDateFormatAndRate = (req, res, next) => {
  const { rate, date } = req.query;
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (date && !dateRegex.test(date)) {
    return res.status(400).json(message1);
  }
  if (rate && !isRateValid(rate)) {
    return res.status(400).json(message2);
  }
  next();
};

module.exports = validateDateFormatAndRate;