import express from "express";
import {getOrders, postOrder} from "../controllers/order-controller.js";
import {
  authenticateToken,
  errorHandler
} from "../../middlewares/middlewares.js";

const orderRouter = express.Router();

//TODO ADD AUTH MIDDLEWARE TO POSTORDER
orderRouter.route("/").get(getOrders).post(authenticateToken, errorHandler, postOrder);


export default orderRouter;
