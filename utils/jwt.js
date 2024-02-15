require('dotenv').config();
const jwt = require('jsonwebtoken');

//const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const { NODE_ENV, JWT_SECRET } = process.env;

const getJwtToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY', { expiresIn: '7d' });

module.exports = {
  getJwtToken,
};