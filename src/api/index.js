import express from 'express';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';
import productRouter from "./routes/product-router.js";
import allergyRouter from "./routes/allergy-router.js";
import ingredientRouter from "./routes/ingredient-router.js";
import categoryRouter from "./routes/category-router.js";

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter)
router.use('/allergies', allergyRouter);
router.use('/ingredients', ingredientRouter);
router.use('/categories', categoryRouter);

export default router;
