const crypto = require('crypto');

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const authenticate = (req, res, next) => {
  const header = req.get('authorization') || '';
  if (!header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Travlr admin"');
    return next(new ApiError(401, 'Administrator credentials required'));
  }
  let credentials;
  try {
    credentials = Buffer.from(header.slice(6), 'base64').toString('utf8');
  } catch (_) {
    return next(new ApiError(401, 'Invalid credentials'));
  }
  const separator = credentials.indexOf(':');
  const user = credentials.slice(0, separator);
  const password = credentials.slice(separator + 1);
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (separator < 1 || !expectedUser || !expectedPassword) {
    return next(new ApiError(401, 'Invalid credentials'));
  }
  const supplied = crypto.createHash('sha256').update(`${user}:${password}`).digest();
  const expected = crypto.createHash('sha256').update(`${expectedUser}:${expectedPassword}`).digest();
  if (!crypto.timingSafeEqual(supplied, expected)) {
    return next(new ApiError(401, 'Invalid credentials'));
  }
  req.user = { role: 'admin' };
  next();
};

const requireRole = role => (req, res, next) =>
  req.user && req.user.role === role ? next() : next(new ApiError(403, 'Insufficient permissions'));

module.exports = { ApiError, authenticate, requireRole };
