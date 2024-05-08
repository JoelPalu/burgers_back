import {
  listAllUsers,
  findUserById,
  addUser,
  removeUser,
  updateUser, getAvatarById,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';
import promisePool from '../../utils/database.js';

//GET ALL USERS
const getUser = async (req, res) => {
  if (res.locals.user.role !== 'admin') {
    res.status(403);
    res.json({message: 'Forbidden'});
    return;
  }
  res.json(await listAllUsers());
}

//GET USER BY ID
const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id, res.locals.user);
  if (user) {
    res.json(user);
    res.status(200);
  } else {
    res.sendStatus(404);
  }
}


//CREATE NEW USER
const postUser = async (req, res) => {
  try {
    // Hash password
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body, req.file);
    delete result.password;

    if (!result) {
      const error = new Error('Invalid or missing fields');
      error.status = 400;
      next(error);
      return;
    }

    if (result.id) {
      try {
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


//UPDATE USER
const putUser = async (req, res) => {
  if (req.body.password){
    req.body.password = await bcrypt.hashSync(req.body.password, 10);
  }
  await updateUser(req.body, req.params.id, res.locals.user, req.file)
  res.status(200)
  res.json({message: 'User: ' + req.params.id + ' updated.'});
}


//DELETE USER
const deleteUser = async (req, res) => {
  const response = await removeUser(req.params.id, res.locals.user);
  res.status(200);
  res.json({'response': response.message});
}

const getAvatar = async (req, res) => {
  const response = await (getAvatarById(req.params.id));
  if (!response) {
    res.sendStatus(404);
    return;
  }
  console.log(response);
  res.status(200);
  res.json({'avatar': response.avatar});
}

const putAvatar = async (req, res) => {
  await updateUser(req.body, req.params.id, res.locals.user, req.file)
  res.status(200)
  res.json({message: 'User: ' + req.params.id + ' updated.', avatar: req.file.filename});
}

export {getUser, getUserById, postUser, putUser, deleteUser, getAvatar, putAvatar};
