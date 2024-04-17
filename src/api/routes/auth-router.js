import express from 'express';
import {getLogOut, getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../../middlewares/middlewares.js';


const authRouter = express.Router();

authRouter.route('/login').post(postLogin);
authRouter.route('/logout').get(getLogOut);

authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
