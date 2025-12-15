import express from 'express';
import {getLogOut, getMe, postLogin, getEmail} from '../controllers/auth-controller.js';
import {
  authenticateToken,
  validationErrors
} from '../../middlewares/middlewares.js';


const authRouter = express.Router();

authRouter.route('/login').post(postLogin);
authRouter.route('/logout').get(getLogOut);

authRouter.route('/me').get(authenticateToken, validationErrors, getMe);
authRouter.route('/email/:email').get(getEmail);

export default authRouter;
