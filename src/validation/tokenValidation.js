const tokenValidation = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  } if (token.length < 16 || token.length > 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

module.exports = tokenValidation;
