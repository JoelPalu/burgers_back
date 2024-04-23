import promisePool from '../../utils/database.js';

const getAllIngredients = async () => {
    const [rows] = await promisePool.query('SELECT * FROM Ingredients');
    if (rows.length === 0) {
      return false;
    }
    return rows;
}

const createIngredient = async (data) => {

  const {name, cal} = data;
  if(!name || !cal){
    return {error: 'Missing required fields'};
  }

  const sql = `INSERT INTO Ingredients (name, cal)
               VALUES (?, ?)`;
  const params = [name, cal];
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return {error: 'Something went wrong with executing the query'};
  }
  return {message: 'New ingredient created'};
}

const ProductToIngredient = async (productId, ingredientId) => {
  console.log('productId', productId, 'ingredientId', ingredientId)
  const sql = `INSERT INTO productToIngredient (product_id, ingredient_id)
               VALUES (?, ?)`;
  const params = [parseInt(productId), parseInt(ingredientId)];
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return {error: 'Something went wrong with executing the query'};
  }
  return {message: 'All products ingredients added'
};

}

const listIngredientsByProductId = async (productId) => {
  const sql = `SELECT Ingredients.* FROM Ingredients
               JOIN productToIngredient
               WHERE productToIngredient.product_id = ?`;

  const params = [productId];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.length === 0) {
    return false;
  }
  return rows;
}

export {
  getAllIngredients,
  createIngredient,
  ProductToIngredient,
  listIngredientsByProductId
}
