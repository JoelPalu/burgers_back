import express from "express";
import {getOrders, postOrder} from "../controllers/order-controller.js";

const orderRouter = express.Router();

//TODO ADD AUTH MIDDLEWARE TO POSTORDER
orderRouter.route("/").get(getOrders).post(postOrder);


export default orderRouter;
