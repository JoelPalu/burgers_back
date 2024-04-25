import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {getUserByEmail} from '../models/user-model.js';
import 'dotenv/config';

// LOGIN
const postLogin = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    res.sendStatus(401);
    res.message = 'Invalid email or password';
    return;
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.sendStatus(401);
    return;
  }
  delete user.password;

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({user: user, token});
};

const getLogOut = async (req, res) => {
  res.json({message: 'logged out'});

};

const getMe = async (req, res) => {
  console.log('getMe', res.locals.user);
  if ( res.locals.user) {
    res.json({message: 'token ok', user:  res.locals.user});
    //res.sendFile(res.locals.user.file);
  } else {
    res.sendStatus(401);
  }
};


const getEmail = async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (user) {
    res.json({state: false, message: 'Email already in use'});
    return;
  }
  res.json({state: true, message: 'Email available'});
};


export {postLogin,getMe ,getLogOut, getEmail};
