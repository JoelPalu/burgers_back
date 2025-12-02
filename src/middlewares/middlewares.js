import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {validationResult} from 'express-validator';
import * as fs from 'fs';
import {getUserByUsername} from '../api/models/user-model.js';


/*
      authentication middleware. Verifies JWT token and attaches user info to res.locals.user where next middleware/controller can access it.
      Useful to have user info available after authentication for authorization checks or user-specific operations.
      removed need to get user info from db again in later middleware/controllers.
*/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }
  /*  verify token
      secret key should be stored in env variable for security and at least 20 chars long
      if secret key is changed all existing tokens become invalid
  */
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

// Thumbnail creation middleware using sharp
// intergration for the profile picture uploads. But not used in this project.
const  createThumbnail = async (req, res, next) => {
  if (!req.file) {
    req.file= {path: "/Public/default.svg"}
    next()
    return;
  }
  const filepath = req.file.path
  const thumbnailPath = filepath + "_thumb.png";
  await sharp(filepath)
    .resize(160, 160)
    .toFormat("png")
    .toFile(thumbnailPath);

  console.log(req.file);
  next()
}

//If user accesses undefined route, this middleware creates a 404 error and passes it to the error handler.
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Huh? Why you are here?? Not Found - ${req.originalUrl}`);
  error.status = 404;

  next(error);
};

// General error handling middleware. Catches errors passed from other middleware/controllers and sends JSON response with error message and status code.
const errorHandler = (err, req, res, next) => {
  console.log("ErrorHandler:", err)
  res.status(err.status || 500);
  res.json({
    message: err.message,
    status : res.status || 500,
  });
}

// Middleware to handle validation errors from express-validator
const validationErrors = async (req, res, next) => {
  // validation errors can be retrieved from the request object (added by express-validator middleware)
  const errors = await validationResult(req);
  // check if any validation errors
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');
    const error = new Error(messages);
    error.status = 400;
    if (req.file){
      fs.unlinkSync(req.file.path);

    }
    next(error);
    return;
  }
  next();
};


// Middleware to check for duplicate email before creating new user
const emailDublicateCheck = async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (user) {
    const error = new Error('Email already exists');
    error.status = 400;
    next(error);
    return;
  }
  next();
};


// Middleware to check for duplicate username before creating new user
const usernameDublicateCheck = async (req, res, next) => {
  // This performs a database query to check if the username already exists
  const user = await getUserByUsername(req.body.username);
  if (user) {
    const error = new Error('Username already exists');
    error.status = 400;
    next(error);
    return;
  }
  next();
}

export {createThumbnail, authenticateToken, notFoundHandler, errorHandler, validationErrors, emailDublicateCheck, usernameDublicateCheck};
