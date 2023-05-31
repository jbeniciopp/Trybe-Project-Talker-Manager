const fs = require('fs').promises;

const fileWriter = async (path, data) => {
  try {
    await fs.writeFile(path, data);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = fileWriter;
