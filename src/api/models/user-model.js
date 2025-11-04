import promisePool from '../../utils/database.js';


// GET ALL USERS
const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM user');
  for (const row of rows) {
    delete row.password;
  }
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
/*  Data is the user data, file is the uploaded file what could contain avatar. But only the file name is actually used.
    Note that at this moment only email and password are required to create a new user
    For future development, more fields can be added, but remember add them on database level as well.
*/
const addUser = async (user, file) => {
  // Check if user is missing any required fields
  for (const key in user) {
    if (!user[key]) {
      return false;
    }
  }
  /* Here we can apply default values for avatar and address if they are missing
      Right now not in use for simplicity

  if (!file.filename) {
    file.filename = "default.svg";
  }
  if (!user.address){
    user.address = null;
  }
  */

  // seperate data from user object and run the insert query.
  const {email, password} = user;
  const sql = `INSERT INTO user (username, password)
               VALUES (?, ?)`;
  //add more parameters when more fields are added to user creation
  const params = [email, password];
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

  console.log('Before tuser', tuser);


  if (tuser.id !== user.id && user.role !== 'admin'){
    console.log('Unauthorized');
    return false;
  }
  if (user.role !== 'admin') {
    console.log('User is not admin');
    delete data.email;
  }
  if (file.filename) {
    tuser.avatar = file.filename;
  }
  if (!tuser.avatar){
    tuser.avatar = 'default.svg';
  }

  console.log("tuser after avatar check",tuser);
  // Compare the data to the user and update the user with the new data
  for (const key in tuser) {
    if (data[key] !== undefined){
       tuser[key] = data[key];
    }
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

// GET USER BY EMAIL
const getUserByEmail = async (email) =>{
  console.log('email', email)
  const sql =  'SELECT * ' +
                      'FROM user ' +
                      'WHERE email = ?';
  const [rows] = await promisePool.execute(sql, [email]);
  if (rows.length === 0){
    return false;
  }
  return rows[0];
}
// GET AVATAR BY ID
// Not used at the moment
/*
const getAvatarById = async (id) => {
  const [rows] = await promisePool.execute('SELECT avatar FROM user WHERE id = ?', [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}
 */
export {listAllUsers, findUserById, addUser, updateUser, removeUser, getUserByEmail, getAvatarById};
