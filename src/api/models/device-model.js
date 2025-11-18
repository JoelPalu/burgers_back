import promisePool from '../../utils/database.js';

// GET ALL DEVICES
const fetchDevices = async () => {
  const [rows] = await promisePool.query('SELECT * FROM devices');
  return rows;
}

// CREATE NEW DEVICE
const addDevice = async (device) => {
  const { name, org } = device;

  if (!name) {
    return { message: 'Name is required' };
  }

  if (!org) {
    return { message: 'Organization is required' };
  }

  const [orgCheck] = await promisePool.execute(
    'SELECT * FROM organisations WHERE orgID = ?',
    [device.org]
  );
  if (orgCheck.length === 0) {
    return { message: 'Organization not found' };
  }


  const [result] = await promisePool.execute(
    'INSERT INTO devices (deviceName) VALUES (?)',
    [name]
  );

  const [deviceOrgResult] = await promisePool.execute(
    'INSERT INTO deviceOwner (deviceID, orgID) VALUES (?, ?)',
    [result.insertId, orgCheck[0].orgID]
  );

  return { deviceID: result.insertId, name, org: device.org};



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

// ADD USER TO DEVICE
const addUserDevice = async (body, user) => {
  const { deviceID } = body;
  const userID = user.userID;

  if (!deviceID) {
    throw new Error('Device ID is required');
  }
  if (!userID) {
    throw new Error('User ID is required');
  }

  // Check if device exists
  const [deviceCheck] = await promisePool.execute(
    'SELECT * FROM devices WHERE deviceID = ?',
    [deviceID]
  );
  if (deviceCheck.length === 0) {
    throw new Error('Device not found');
  }

  // Check if user exists
  const [userCheck] = await promisePool.execute(
    'SELECT * FROM users WHERE userID = ?',
    [userID]
  );
  if (userCheck.length === 0) {
    throw new Error('User not found');

  }


  await promisePool.execute(
    'INSERT INTO useraccess (userID, deviceID) VALUES (?, ?)',
    [userID, deviceID]
  );

  return { message: 'User added to device' };
}



const checkUserAccessToDevice = async (userID, deviceID) => {


  const [rows] = await promisePool.execute(
    `SELECT * FROM useraccess
     WHERE userID = ? AND deviceID = ?`,
    [userID, deviceID]
  );

  return rows.length > 0;
}

const fetchDeviceStatus = async (deviceID) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM status WHERE deviceID = ?',
    [deviceID]
  );
  if (rows.length === 0) {
    throw new Error('Status not found for the device');
  }


  const status = rows[0];

  const [rows1] = await promisePool.execute(
    'SELECT * FROM alert WHERE deviceID = ?',
    [deviceID]
  );

  status.alerts = rows1;


  return status;
}

export {
  fetchDevices,
  addDevice,
  fetchDeviceById,
  modifyDevice,
  removeDevice,
  addUserDevice,
  checkUserAccessToDevice,
  fetchDeviceStatus

};
