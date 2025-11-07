
import {
  addDevice,
  fetchDeviceById,
  fetchDevices, modifyDevice, removeDevice,
} from '../models/device-model.js';


const getDevices = async (req, res) => {

  try {
    // Fetch devices from the database
    const devices = await fetchDevices();
    return res.status(200).json(devices);
  }
  catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

const postDevice = async (req, res) => {
  try {
    // Create a new device in the database
    const newDevice = await addDevice(req.body);
    return res.status(201).json(newDevice);
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


const getDeviceById = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch device by ID from the database
    const device = await fetchDeviceById(id);
    return res.status(200).json(device);
  }
  catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

const putDevice = async (req, res) => {
  const id = req.params.id;

  try {
    // Update device in the database
    const updatedDevice = await modifyDevice(id, req.body);
    return res.status(200).json(updatedDevice);
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const deleteDevice = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete device from the database
    await removeDevice(id);
    return res.status(204).send();
  }
  catch (error) {
    return res.status(404).json({ message: error.message });
  }
}
export {
  getDevices,
  postDevice,
  getDeviceById,
  putDevice,
  deleteDevice,
};
