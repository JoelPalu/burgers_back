import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {getUserByEmail} from '../models/user-model.js';
import 'dotenv/config';

// LOGIN
const postLogin = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  console.log('user', user)
  if (!user) {
    return res.status(401).json({message: 'Invalid email or password'});

  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({message: 'Invalid email or password'});

  }
  delete user.password;

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return res.json({user: user, token});
};

const getLogOut = async (req, res) => {
  res.json({message: 'logged out'});

};

const getMe = async (req, res) => {
  const user = await getUserByEmail(res.locals.user.email);
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
