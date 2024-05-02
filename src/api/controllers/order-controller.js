import {
  createOrder,
  fetchOrders,
  removeOrder,
  updateOrder
} from "../models/order-model.js";
import {fetchRestaurants} from "../models/restaurant-model.js";
import {orderToProducts} from "../models/product-model.js";

const getOrders = async (req, res) => {
  try {
    const orders = await fetchOrders()
    res.status(200).json(orders);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const postOrder = async (req, res) => {
  req.body.user_id = res.locals.user.id;
  //req.body.address = 'yepLand 2';

  const restaurants = await fetchRestaurants();
  const restaurant = restaurants.find((restaurant) => restaurant.address === req.body.restaurant);
  if (!restaurant) {
    return res.status(404).json({message: "Restaurant not found"});
  }
  req.body.restaurant = restaurant;

  req.body.date = Date.now();

  if (!req.body.products) {
    return res.status(404).json({message: "No products in order"});
  }

  //must return the order id
  const order = await createOrder(req.body);
  const products = await orderToProducts(req.body, order.insertId);
  !order ?
    res.status(404).json({message: "Order not created"}) :
    res.status(200).json({message: "Order created"});

  // const orderToProducts = await connectOrderToProducts(req.body, order.insertId);
  //
  // if (!orderToProducts) {
  //   await removeOrder(order.insertId);
  //   return res.status(404).json({message: "Order not connected to products"});
  // }

  console.log('Order created successfully. Id:', order.insertId);
  return res.status(200).json({message: `Order created successfully. Id: ${order.insertId}`});

}

const putOrder = async (req, res) => {
  if (res.locals.user.role !== 'admin') {
    return res.status(403).json({message: "Forbidden"});
  }
  const order = await updateOrder(req.body);
  !order ?
    res.status(404).json({message: "Order not updated"}) :
    res.status(200).json(order);
}


const deleteOrder = async (req, res) => {
  if (res.locals.user.role !== 'admin') {
    return res.status(403).json({message: "Forbidden"});
  }
  await removeOrder(req.params.id);
  return res.status(200).json({message: `Order ${req.params.id} deleted`});
};

export { getOrders, postOrder, putOrder, deleteOrder }
