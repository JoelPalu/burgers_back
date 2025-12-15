import express from 'express';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';
import orgRouter from "./routes/org-router.js";
import deviceRouter from './routes/device-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/org', orgRouter);
router.use('/devices', deviceRouter);

export default router;
