import express from 'express';
import {
  getProduct,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct,
} from '../controllers/product-controller.js';
import multer from "multer";
import {storageProducts,} from "../multer.js";
import {validationErrors} from "../../middlewares/middlewares.js";

const productRouter = express.Router();

const upload = multer({storage: storageProducts});

productRouter.route('/')
  .get(getProduct)
  .post(upload.single('file'),
    validationErrors,
    postProduct);

productRouter.route('/:id').get(getProductById).put(putProduct).delete(deleteProduct);

export default productRouter;
