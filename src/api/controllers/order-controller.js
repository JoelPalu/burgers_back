import {
  createOrder,
  fetchOrders,
  removeOrder,
  updateOrder
} from "../models/order-model.js";
import {findProductById, orderToProducts} from "../models/product-model.js";
import {connectOrderToCustomProduct, addCustomProduct, customProductToIngredient} from "../models/customProduct-model.js";

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
  req.body.date = Date.now();

  if (!req.body.products) {
    return res.status(404).json({message: "No products in order"});
  }

  //must return the order id
  const order = await createOrder(req.body);
  const orderContent = JSON.parse(req.body.products);
  for (const product of orderContent) {

    //if the product is a custom product
    if (product.added.length > 0 || product.removed.length > 0) {

      //get original product to get the price
      const originalProduct = await findProductById(product.id);
      if (!originalProduct) {
        await removeOrder(order.insertId);
        return res.status(404).json({message: "Product not found. Order removed"});
      }
      //add the price of the added ingredients
      originalProduct.price += product.added.length

      //add the price of the removed ingredients
      const newProduct = await addCustomProduct(order.insertId, product.id, originalProduct.price);
      if (!newProduct) {
        await removeOrder(order.insertId);
        return res.status(404).json({message: "Custom product not added. Order removed"});
      }

      //add the added and removed ingredients to the custom product
      if (product.added.length > 0) {
        for (const ingredient of product.added) {
          const customProductIngredients = await customProductToIngredient(newProduct, ingredient, 'added');
          if (!customProductIngredients) {
            await removeOrder(order.insertId);
            return res.status(404).json({message: "Custom product ingredients not added. Order removed"});
          }
        }
      }
      if (product.removed.length > 0) {
        console.log('product.removed', product.removed)
        for (const ingredient of product.removed) {
          const customProductIngredients = await customProductToIngredient(newProduct, ingredient, 'removed');
          if (!customProductIngredients) {
            await removeOrder(order.insertId);
            return res.status(404).json({message: "Custom product ingredients not added. Order removed"});
          }
        }
      }

      //connect the custom product to the order
      const customProdToOrder = await connectOrderToCustomProduct(newProduct, order.insertId);
      if (customProdToOrder.warningStatus !== 0) {
        await removeOrder(order.insertId);
        return res.status(404).json({message: "Custom product not connected to order. Order removed"});
      }

      //if the product is a regular product
    } else {
      //connect the product to the order
      const products = await orderToProducts(product.id, order.insertId);
      if (!products) {
        await removeOrder(order.insertId);
        return res.status(404).json({message: "Products not added. Order removed"});
      }
    }
  }
  !order ?
    res.status(404).json({message: "Order not created"}) :
    "";


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
