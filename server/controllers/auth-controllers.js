const User = require('../db/models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'email already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'user signed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'email or password is incorrect' });
  }

  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) {
    return res.status(401).json({ message: 'email or password is incorrect' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.KEY, {
    expiresIn: '7d',
  });

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports.checkRoleDemo = (req, res) => {
  return res.status(200).json({ message: 'its working' });
};
