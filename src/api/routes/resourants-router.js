import express from 'express';
import {getRestaurants} from "../controllers/restaurant-controller.js";

const restaurantsRouter = express.Router();

restaurantsRouter.route('/')
  .get(getRestaurants);


export default restaurantsRouter;
