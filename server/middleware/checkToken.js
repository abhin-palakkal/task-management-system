const jwt = require('jsonwebtoken');

const checkToken = role => {
  return (req, res, next) => {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        return res.status(401).json({ message: 'you are not authorized' });
      }

      const token = bearerToken.split(' ')[1];

      const isVerify = jwt.verify(token, process.env.KEY);
      req.user = isVerify;
      if (!role.includes(isVerify.role)) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }
  };
};

module.exports = checkToken;
