const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email:user.email,phone: user.phone, gender: user.gender, role: user.role }, process.env.JWT_KEY, {
    expiresIn: '1d'
  });
};

module.exports = generateToken;
