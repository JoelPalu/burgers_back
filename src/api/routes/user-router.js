import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getAvatar, putAvatar
} from '../controllers/user-controller.js';
import multer from 'multer';
import {storage} from '../multer.js';
import {
  authenticateToken,
  createThumbnail,
  emailDublicateCheck,
  usernameDublicateCheck,
  validationErrors,
} from '../../middlewares/middlewares.js';
import {body} from 'express-validator';

const userRouter = express.Router();

const upload = multer({storage: storage});

/*
  authenticateToken is used to protect routes that require authentication
  You can extract user information from the token in res.locals.user

  For example getUser, getUserById, putUser, deleteUser routes require a valid token to access
  createThumbnail middleware is used to create a thumbnail of the uploaded image file
  emailDublicateCheck middleware checks if the email already exists in the database before creating a new user
  usernameDublicateCheck middleware checks if the username already exists in the database before creating a new user

 All processes include validateionErrors middleware to handle validation errors
 For example body('password').isLength({min: 5}) checks that password is at least 5 characters long
 As well it will reduce useless entries to the database
 */
// you can add  body('email').isEmail().notEmpty() for email validation etc. Can be useful when integrating with office 365 account
// Create new user route with validation and email duplicate check emailDublicateCheck,
// For now username duplicate check only
userRouter.route('/')
  .get(authenticateToken,
    validationErrors,
    getUser)
  .post(upload.single('file'),
    body('password').isLength({min: 5}),
    usernameDublicateCheck,
    validationErrors,
    createThumbnail,
    postUser);

userRouter.route('/:id')
  .get(authenticateToken,
    validationErrors,
    getUserById)
  .put(
    authenticateToken,
    upload.single('file'),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 5 }),
    usernameDublicateCheck,
    validationErrors,
    createThumbnail,
    putUser)
  .delete(authenticateToken,
    validationErrors,
    deleteUser);

userRouter.route('/avatar/:id').get(getAvatar)
  .put(authenticateToken,
    upload.single('file'),
    validationErrors,
    putAvatar);
export default userRouter;
