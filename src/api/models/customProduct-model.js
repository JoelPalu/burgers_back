import promisePool from '../../utils/database.js';

const addCustomProduct = async (id, item, price) => {
  console.log('addCustomProduct', id, item, price)
  const [results] = await promisePool.execute(
    'INSERT INTO customProduct (order_id, product_id, price) VALUES (?, ?, ?)',
    [id, item, price]
  );

  if (results.affectedRows === 0) {
    throw new Error('Failed to add custom product');
  }
  return results.insertId;
};

const customProductToIngredient = async (item, ingredient, status) => {
  console.log('customProductToIngredient', item, ingredient, status)
    const [results] = await promisePool.execute(
      'INSERT INTO customProductToIngredients (customProduct_id, ingredient_id, status) VALUES (?, ?, ?)',
      [item, ingredient, status]
    );

    if (results.affectedRows === 0) {
      throw new Error('Failed to add custom product to ingredient');
    }
  return true;
};

const connectOrderToCustomProduct = async (prod_id, ord_id) => {
  console.log('connectOrderToCustomProduct', prod_id, ord_id)
  const [results] = await promisePool.execute(
    'INSERT INTO orderToProduct (order_id, custom_product_id) VALUES (?, ?)',
    [ord_id, prod_id]
  );

  if (results.affectedRows === 0) {
    throw new Error('Failed to connect order to custom product');
  }
  return results;

};

export {addCustomProduct, customProductToIngredient, connectOrderToCustomProduct};
