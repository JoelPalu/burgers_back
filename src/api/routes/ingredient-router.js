import express from "express";
import {validationErrors} from "../../middlewares/middlewares.js";
import {
  getIngredients,
  postIngredient,
  getIngredientsByProductId
} from "../controllers/ingredient-controller.js";




const ingredientRouter = express.Router();


ingredientRouter.route('/').get(getIngredients).post(postIngredient);

ingredientRouter.route('/:id')
//.get(getAllergyById).put(putAllergy).delete(deleteAllergy);
ingredientRouter.route('/product/:id').get(getIngredientsByProductId);
export default ingredientRouter;
