import promisePool from '../../utils/database.js';
import {json} from "express";

const fetchOrders = async () => {
  const sql = 'SELECT * FROM orders';

  const [rows] = await promisePool.execute(sql);
  return rows;
};


const createOrder = async (order) => {

  console.log(order.user_id, order.restaurant, order.date, order.order_type, order.address)
  const sql = 'INSERT INTO orders (user_id, res_id, date, order_type, address) VALUES (?, ?, ?, ?, ?)';

  const [result] = await promisePool.execute(sql, [order.user_id, order.restaurant.id, order.date, order.order_type, order.address]);
  return result;
};

const removeOrder = async (id) => {
  const sql = 'DELETE FROM orders WHERE id = ?';

  await promisePool.execute(sql, [id]);
  console.log('Order removed:', id)
};

const updateOrder = async (body) => {
  const content = {
    state: body.state,
    address: body.address,
    order_type: body.order_type,
    res_id: body.res_id,
    user_id: body.user_id
  };
  const update =[];
  const values = [];
  for (const key in content) {
    if (content[key] === undefined) {
      delete content[key];
    } else {
      update.push(`${key} = ?`);
      values.push(content[key]);
    }

  }
  values.push(body.order_id);


  const sql = `UPDATE orders SET ${update.join(', ')} WHERE id = ?`;
  const [result] = await promisePool.execute(sql, values);
  if (result.affectedRows === 0) {
    return false;
  }
  return {message: 'Order state updated'};

};

export { fetchOrders, createOrder, removeOrder, updateOrder };
