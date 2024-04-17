import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {validationResult} from 'express-validator';
import res from 'express/lib/response.js';
import * as fs from 'fs';

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

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


const notFoundHandler = (req, res, next) => {
  const error = new Error(`Huh? Why you are here?? Not Found - ${req.originalUrl}`);
  error.status = 404;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log("ErrorHandler:", err)
  res.status(err.status || 500);
  res.json({
    message: err.message,
    status : res.status || 500,
  });
}

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

export {createThumbnail, authenticateToken, notFoundHandler, errorHandler, validationErrors};
