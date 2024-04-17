import {
  listAllUsers,
  findUserById,
  addUser,
  removeUser,
  updateUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';
import promisePool from '../../utils/database.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
}

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
    res.status(200);
  } else {
    res.sendStatus(404);
  }
}

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body, req.file);

    if (!result) {
      const error = new Error('Invalid or missing fields');
      error.status = 400;
      next(error);
      return;
    }

    if (result.user_id) {
      try {
        const sql = 'INSERT INTO users (name, username, email, role, password, file) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [req.body.name, req.body.username, req.body.email, 'user', req.body.password, req.file.path];
        promisePool.execute(sql, params);
        res.status(201).json({message: 'New user added.', result});
      } catch (error) {
        res.status(400).json({message: 'Failed to add user. Check your input data.' +error});
      }
    }
    else
      {
        res.status(400).json({message: 'Failed to add user. Check your input data.' + result});
      }

  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message});
  }
}

const putUser = async (req, res) => {
  await updateUser(req.body, req.params.id, res.locals.user, req.file)
  res.status(200)
  res.json({message: 'User: ' + req.params.id + ' updated.'});

}

const deleteUser = async (req, res) => {
  const response = await removeUser(req.params.id, res.locals.user);
  res.status(200);
  res.json({'response': response.message});
}

export {getUser, getUserById, postUser, putUser, deleteUser};
