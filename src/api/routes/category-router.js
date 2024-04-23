import express from "express";
import {validationErrors} from "../../middlewares/middlewares.js";
import {getAllCategories} from "../models/category-model.js";
import {
  getCategories,
  postCategory
} from "../controllers/category-controller.js";


const categoryRouter = express.Router();


categoryRouter.route('/').get(getCategories).post(postCategory);

categoryRouter.route('/:id')
//.get(getAllergyById).put(putAllergy).delete(deleteAllergy);
//allergyRouter.route('/array/').get(getAllergyByArray);
export default categoryRouter;
