const isRateValid = (rate) => {
  const numbered = Number(rate);
  return !Number.isNaN(numbered) && Number.isInteger(numbered) && numbered >= 1 && numbered <= 5;
};

module.exports = isRateValid;