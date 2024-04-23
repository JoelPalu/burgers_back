import promisePool from '../../utils/database.js';
import bcrypt from "bcrypt";


// GET ALL USERS
const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM user');
  return rows;
};


// GET USER BY ID
const findUserById = async (id, user) => {
  console.log('user', user);
  console.log('id', id);

  // Debugging information
  console.log('user.role:', user.role);
  console.log('user.id:', user.id);
  console.log('id:', id);
  console.log('Number(user.id) !== id:', Number(user.id) !== Number(id));

  if (user.role !== 'admin' && Number(user.id) !== Number(id) ){
    console.log('Unauthorized triggered');
    return false;
  }
  console.log('Authorized');
  const [rows] = await promisePool.execute('SELECT * FROM user WHERE id = ?', [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};


// CREATE NEW USER
const addUser = async (user, file) => {
  // Check if user is missing any required fields
  for (const key in user) {
    if (!user[key]) {
      return false;
    }
  }
  if (!file.filename) {
    file.filename = "default.svg";
  }
  if (!user.address){
    user.address = null;
  }

  const {name, username, email, password, address} = user;
  const sql = `INSERT INTO user (username, email, password, avatar, address)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [username, email, password, file.filename, address];
  const [result] = await promisePool.execute(sql, params);


  const [rows] = await promisePool.execute('SELECT * FROM user WHERE id = ?', [result.insertId]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

// UPDATE USER
//Data is the new data, id is the id of the user to be updated, user is the user that is logged in, file is the new file
const updateUser = async (data, id, user, file) => {

  // Check if user is missing any required fields
  const tuser = await findUserById(id, user);
  console.log('data', data);
  console.log('Before tuser', tuser);


  if (tuser.id !== user.id && user.role !== 'admin'){
    console.log('Unauthorized');
    return false;
  }
  if (tuser.role !== 'admin') {
    delete data.email;
  }
  // Compare the data to the user and update the user with the new data
  for (const key in tuser) {
    if (data[key] !== undefined){
       tuser[key] = data[key];
    }
  }
  if (file) {
    tuser.avatar = file.filename;
  } else {
    tuser.avatar = null;
  }

  console.log('After tuser', tuser);
  // Updates whole user with new data. Thats why we compare the data before updating
  let sql = promisePool.format(
    `UPDATE user SET ? WHERE id = ?`,
    [tuser, id]
  );

  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
}


// REMOVE USER
const removeUser = async (id, user) => {
  console.log('user', user, id);

  if (Number(user.id) !== Number(id) && user.role !== 'admin') {
    return {message: 'Unauthorized'};
  }

  let sql = promisePool.format(
    `DELETE FROM user WHERE id = ?`,
    [id]
  );

  const [result] = await promisePool.execute(sql);
  console.log('result', result);
  if (result.affectedRows !== 0) {
    return {message: 'User removed successfully'};
  }

  return {message: 'Invalid data or user does not exist'};
}

// GET USER BY USERNAME
const getUserByUsername = async (username) =>{

  const sql =  'SELECT * ' +
                      'FROM user ' +
                      'WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0){
    return false;
  }
  return rows[0];
}

const getAvatarById = async (id) => {
  const [rows] = await promisePool.execute('SELECT avatar FROM user WHERE id = ?', [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}

export {listAllUsers, findUserById, addUser, updateUser, removeUser, getUserByUsername, getAvatarById};
