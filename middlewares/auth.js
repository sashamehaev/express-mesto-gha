const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
