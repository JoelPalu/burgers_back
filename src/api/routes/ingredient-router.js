import express from "express";
import {validationErrors} from "../../middlewares/middlewares.js";
import {
  getIngredients,
  postIngredient
} from "../controllers/ingredient-controller.js";



const ingredientRouter = express.Router();


ingredientRouter.route('/').get(getIngredients).post(postIngredient);

ingredientRouter.route('/:id')
//.get(getAllergyById).put(putAllergy).delete(deleteAllergy);
export default ingredientRouter;
