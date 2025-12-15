import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import {getUserByUsername} from '../models/user-model.js';

/*
 Authentication controller

  Handles user login, logout, and token verification

  Uses JWT for token management

  Passwords are hashed using bcrypt

  Exposes endpoints for:
  - POST /login : User login
  - GET /logout : User logout
  - GET /me : Verify token and get user info
  - GET /email/:email : Check if email is already in use

  Each function interacts with the user model to retrieve user data
  and performs necessary authentication checks.
  Returns appropriate HTTP status codes and messages based on the outcome

  Logout is handled client-side by deleting the token. it can be implemented server-side by maintaining a token blacklist.

 */

// LOGIN
const postLogin = async (req, res) => {
  // Check if user exists, return 401 if not
  const user = await getUserByUsername(req.body.username);
  console.log('user', user)
  if (!user) {
    return res.status(401).json({message: 'Invalid username or password'});
  }
  // Check if password matches, return 401 if not
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({message: 'Invalid username or password'});
  }

  // Remove password from user object before sending it back. If it gets leaked, it's hashed anyway. But better safe than sorry.
  delete user.password;

  // Create JWT token and expiration time. Normally its 15 minutes for security reasons. For testing we can set it longer.
  //TODO : set expiration time to 15min in production
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return res.json({user: user, token});
};


/* LOGOUT
   Logout can be handled client-side by deleting the token. It can be implemented server-side by maintaining a token blacklist.
   TODO: implement server-side logout if needed.
 */
const getLogOut = async (req, res) => {
  res.json({message: 'logged out'});
};


// VERIFY TOKEN AND GET USER INFO
// If token is valid, return user info. Otherwise return the call will not reach this point because of the auth middleware.
const getMe = async (req, res) => {
  /* Fetch user from database to get the most recent data. we don't rely solely on the token data.
  We could also just return res.locals.user, but this way we ensure the data is up-to-date.
  We use the username from the token to fetch the user from the database.
  */
  const user = await getUserByUsername(res.locals.user.username);
  // Remove password before sending user data
  delete user.password;

  // If user exists, return user data
  if (res.locals.user) {
    res.json({message: 'token ok', user:  user});
  } else {
    res.sendStatus(401);
  }
};

// CHECK IF EMAIL IS ALREADY IN USE
// This one is not used in the app. But can be introduced in the future for registration.
// Used in middleware
const getEmail = async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  if (user) {
    res.json({state: false, message: 'Email already in use'});
    return;
  }
  res.json({state: true, message: 'Email available'});
};


export {postLogin,getMe ,getLogOut, getEmail};
