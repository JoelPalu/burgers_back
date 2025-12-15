import express from "express";
import {
  deleteOrder,
  getOrders,
  postOrder,
  putOrder
} from "../controllers/order-controller.js";
import {
  authenticateToken,
  errorHandler, validationErrors
} from "../../middlewares/middlewares.js";
import {removeOrder} from "../models/order-model.js";

const orderRouter = express.Router();

//TODO ADD AUTH MIDDLEWARE TO POSTORDER
orderRouter.route("/")
  .get( authenticateToken,
        validationErrors,
        getOrders)

  .post(authenticateToken,
        validationErrors,
        postOrder)

  .put( authenticateToken,
        validationErrors,
        putOrder);

orderRouter.route("/:id")
  .delete(authenticateToken,
          validationErrors,
          deleteOrder);



export default orderRouter;
