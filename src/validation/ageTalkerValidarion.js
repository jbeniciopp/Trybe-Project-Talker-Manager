const ageTalkerValidarion = (req, res, next) => {
  const { age } = req.body;

  if (age < 18 || typeof age !== 'number' || !Number.isInteger(age)) {
    return res.status(400)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }

  next();
};

module.exports = ageTalkerValidarion;
