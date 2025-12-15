import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import {getUserByUsername} from '../models/user-model.js';

// LOGIN
const postLogin = async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  console.log('user', user)
  if (!user) {
    return res.status(401).json({message: 'Invalid username or password'});

  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({message: 'Invalid username or password'});

  }
  delete user.password;
  // Create JWT token and experation time. Normally its 15 minutes for security reasons. For testing we can set it longer.
  //TODO : set experation time to 15min in production
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return res.json({user: user, token});
};

const getLogOut = async (req, res) => {
  res.json({message: 'logged out'});

};

const getMe = async (req, res) => {
  const user = await getUserByUsername(res.locals.user.username);
  delete user.password;
  if (res.locals.user) {
    res.json({message: 'token ok', user:  user});
  } else {
    res.sendStatus(401);
  }
};


const getEmail = async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  if (user) {
    res.json({state: false, message: 'Email already in use'});
    return;
  }
  res.json({state: true, message: 'Email available'});
};


export {postLogin,getMe ,getLogOut, getEmail};
