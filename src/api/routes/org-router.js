import express from 'express';
import {getOrgs} from '../controllers/org-controller.js';

const orgRouter = express.Router();

/*
  This whole section is for future expansion.
  Currently, we only have a GET endpoint to retrieve organizations.
  We add organizations through database seeding.
  Organisation used to what device is assigned to which org. As well could be used to check what users are part of which org.
*/

orgRouter.route('/')
  .get(getOrgs);


export default orgRouter;
