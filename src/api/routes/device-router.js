import express from 'express';
import {
  authenticateToken,
  validationErrors,
} from '../../middlewares/middlewares.js';
import {
  addUsertoDevice,
  deleteDevice,
  getDeviceById,
  getDevices,
  postDevice, putDevice,
} from '../controllers/device-controller.js';



const deviceRouter = express.Router();

deviceRouter.route('/')
  .get(authenticateToken,
    validationErrors,
    getDevices)
  .post(authenticateToken,
    validationErrors,
    postDevice)

deviceRouter.route('/:id')
  .get(authenticateToken,
    validationErrors,
    getDeviceById)
  .put(authenticateToken,
    validationErrors,
    putDevice)
  .delete(authenticateToken,
    validationErrors,
    deleteDevice);

deviceRouter.route('/user')
  .post(authenticateToken,
    validationErrors,
    addUsertoDevice)


export default deviceRouter;
