import express from 'express';
import {getLogOut, getMe, postLogin, getEmail} from '../controllers/auth-controller.js';
import {
  authenticateToken,
  validationErrors
} from '../../middlewares/middlewares.js';


const authRouter = express.Router();
/*
  This section handles authentication-related routes.
  We have endpoints for logging in, logging out, retrieving the current user's information,
 */
// This one will receive username and password, validate them, and return a JWT token if valid.
authRouter.route('/login').post(postLogin);

// This one is just a placeholder. Actual logout logic (like token invalidation) would be handled on the client side or with a token blacklist.
authRouter.route('/logout').get(getLogOut);

authRouter.route('/me').get(authenticateToken, validationErrors, getMe);
authRouter.route('/email/:email').get(getEmail);

export default authRouter;
