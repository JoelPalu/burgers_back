import {
  addProduct,
  listAllProducts,
  findProductById,
  updateProduct,
  removeProduct,
} from '../models/product-model.js';
import {addProductToIngredient} from "./ingredient-controller.js";
import {addProductToCategory} from "./category-controller.js";

const getProduct = async (req, res) => {
  const products = await listAllProducts();
  if (!products) {
    res.sendStatus(404);
    return;
  }
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await findProductById(req.params.id);
  if (!product) {
    res.sendStatus(404);
    return;
  }
  res.json(product);
};

const postProduct = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.ingredients) {
      const error = new Error("Invalid or missing fields, name/price/ingredients/category required")
      error.status = 400
      next(error);
      return;
    }


    const result = await addProduct(req.body, req.file);
    if (!result) {
      const error = new Error("Invalid or missing fields. name or price")
      error.status = 400
      next(error);
      return;
    }
    const resultIngredient = await addProductToIngredient(result.id, req.body.ingredients);
    if (!resultIngredient) {


      const error = new Error("Invalid or missing fields. ingredients missing or invalid")
      error.status = 400
      next(error);
      return;
    }
    const resultCategory = await addProductToCategory(result.id, req.body.category);
    if (!resultCategory) {
      const error = new Error("Invalid or missing fields. category missing or invalid")
      error.status = 400
      next(error);
      return;
    }
    res.status(201);
    res.json(resultCategory);
  } catch (error) {
    next(error)
  }
};

const putProduct = async (req, res) => {
  const result = await updateProduct(req.body, req.params.id);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.json(result);
};

const deleteProduct = async (req, res) => {
  const result = await removeProduct(req.params.id);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.json(result);
};

export {getProduct, getProductById, postProduct, putProduct, deleteProduct};
