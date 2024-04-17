import {
  addProduct,
  listAllProducts,
  findProductById,
  updateProduct,
  removeProduct,
} from '../models/product-model.js';

const getProduct = async (req, res) => {
  const products = res.json(await listAllProducts());
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
    const result = await addProduct(req.body);
    if (!result) {
      const error = new Error("Invalid or missing fields")
      error.status = 400
      next(error);
      return;
    }
    res.status(201);
    res.json(result);
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
