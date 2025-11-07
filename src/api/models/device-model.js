import promisePool from '../../utils/database.js';

// GET ALL DEVICES
const fetchDevices = async () => {
  const [rows] = await promisePool.query('SELECT * FROM devices');
  return rows;
}

// CREATE NEW DEVICE
const addDevice = async (device) => {
  const { name } = device;

  if (!name) {
    return { message: 'Name is required' };
  }


  const [result] = await promisePool.execute(
    'INSERT INTO devices (deviceName) VALUES (?)',
    [name]
  );

  return { deviceID: result.insertId, name };

}

// GET DEVICE BY ID
const fetchDeviceById = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM devices WHERE deviceID = ?', [id]);
  if (rows.length === 0) {
    throw new Error('Device not found');
  }
  return rows[0];
}

// UPDATE DEVICE
const modifyDevice = async (id, device) => {
  const { name } = device;

  if (!name) {
    throw new Error('Name is required');
  }
  const [result] = await promisePool.execute(
    'UPDATE devices SET deviceName = ? WHERE deviceID = ?',
    [name, id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Device not found');
  }
  return { deviceID: id, name };
}

// DELETE DEVICE
const removeDevice = async (id) => {
  const [result] = await promisePool.execute('DELETE FROM devices WHERE deviceID = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Device not found');
  }
  return { message: 'Device removed' };
}

export {
  fetchDevices,
  addDevice,
  fetchDeviceById,
  modifyDevice,
  removeDevice
};
