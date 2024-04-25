import promisePool from '../../utils/database.js';

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

export { fetchOrders, createOrder, removeOrder };
