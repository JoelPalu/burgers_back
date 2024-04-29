import express from "express";
import {
  getOrders,
  postOrder,
  putOrder
} from "../controllers/order-controller.js";
import {
  authenticateToken,
  errorHandler, validationErrors
} from "../../middlewares/middlewares.js";

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




export default orderRouter;
