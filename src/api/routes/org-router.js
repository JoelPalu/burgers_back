import express from 'express';
import {getOrgs} from '../controllers/org-controller.js';

const orgRouter = express.Router();

orgRouter.route('/')
  .get(getOrgs);


export default orgRouter;
