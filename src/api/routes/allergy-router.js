import express from "express";
import {validationErrors} from "../../middlewares/middlewares.js";
import {
  getAllergies,
  getAllergyByArray,
  postAllergy
} from "../controllers/allergy-contoller.js";

const allergyRouter = express.Router();


allergyRouter.route('/').get(getAllergies).post(postAllergy);

allergyRouter.route('/:id')
  //.get(getAllergyById).put(putAllergy).delete(deleteAllergy);
//allergyRouter.route('/array/').get(getAllergyByArray);
export default allergyRouter;
