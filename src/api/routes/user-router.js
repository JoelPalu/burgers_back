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
  createThumbnail, emailDublicateCheck, validationErrors,
} from '../../middlewares/middlewares.js';
import {body} from 'express-validator';

const userRouter = express.Router();

const upload = multer({storage: storage});

// you can add  body('email').isEmail().notEmpty() for email validation etc. Can be useful when integrating with office 365 account
// Create new user route with validation and email duplicate check emailDublicateCheck,
userRouter.route('/')
  .get(authenticateToken,
    validationErrors,
    getUser)
  .post(upload.single('file'),
    body('password').isLength({min: 5}),
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
