import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM user');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM user WHERE id = ?', [id]);
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user, file) => {
  user = {
    name: user.name !== undefined ? user.name : null,
    username: user.username !== undefined ? user.username : null,
    email: user.email !== undefined ? user.email : null,
    role: user.role !== undefined ? user.role : null,
    password: user.password !== undefined ? user.password : null
  };
  if (file === undefined) {
    const file = {};
    file.path = "Public/default.svg";
  }
  if (user.role === undefined) {
    user.role = 'user';
  }
  console.log('user', user);
  const {name, username, email, role, password} = user;
  const sql = `INSERT INTO user (username, email)
               VALUES (?, ?)`;
  const params = [username, email];
  const [result] = await promisePool.execute(sql, params);
  console.log('result', result);

  const [rows] = await promisePool.execute('SELECT * FROM user WHERE id = ?', [result.insertId]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const updateUser = async (data, id, user, file) => {

  const tuser = await findUserById(id);
  console.log('data', data);
  console.log('Before tuser', tuser);
  if (tuser.user_id !== user.user_id) {
    return false;
  }
  for (const key in tuser) {
    if (data[key] !== undefined){
       tuser[key] = data[key];
    }
  }
  if (file !== undefined) {
    tuser.file = file.path;
  }
  console.log('After tuser', tuser);
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

const removeUser = async (id, user) => {
  console.log('user', user, id);

  if (Number(user.user_id) !== Number(id) && user.role !== 'admin') {
    return {message: 'Unauthorized'};
  }

  let sql = promisePool.format(
    `DELETE FROM user WHERE id = ?`,
    [id]
  );

  const [result] = await promisePool.execute(sql);
  console.log('result', result);
  if (result.affectedRows === 0) {
    return {message: 'User removed successfully'};
  }
  return {message: 'User removed successfully'};
}

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

export {listAllUsers, findUserById, addUser, updateUser, removeUser, getUserByUsername};
