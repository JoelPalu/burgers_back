import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getAvatar
} from '../controllers/user-controller.js';
import multer from 'multer';
import {storage} from '../multer.js';
import {
  authenticateToken,
  createThumbnail, validationErrors,
} from '../../middlewares/middlewares.js';
import {body} from 'express-validator';

const userRouter = express.Router();

const upload = multer({storage: storage});

userRouter.route('/')
  .get(getUser)
  .post(upload.single('file'),
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    validationErrors,
    createThumbnail,
    postUser);

userRouter.route('/:id')
  .get(authenticateToken,
    validationErrors,
    getUserById)
  .put(authenticateToken,
    upload.single('file'),
    body('username').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 5 }),
    validationErrors,
    createThumbnail,
    putUser)
  .delete(authenticateToken,
    validationErrors,
    deleteUser);

userRouter.route('/avatar/:id').get(getAvatar);
export default userRouter;
