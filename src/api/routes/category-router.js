import express from "express";
import {
  getCategories,
  postCategory,
  getCategoriesByProductId
} from "../controllers/category-controller.js";


const categoryRouter = express.Router();


categoryRouter.route('/').get(getCategories).post(postCategory);


categoryRouter.route('/product/:id').get(getCategoriesByProductId);
export default categoryRouter;
