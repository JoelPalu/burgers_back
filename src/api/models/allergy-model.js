import promisePool from '../../utils/database.js';

/**
 * Get all allergies
 */
const getAllAlleries = async (req, res) => {
    const [rows] = await promisePool.query('SELECT * FROM allergies');
    if (rows.length === 0) {
      return false;
    }
    return rows;
}

const createAllergy = async (data, res) => {

  console.log('req', data)
  const {name} = data;
  if(!name){
    return {error: 'Missing required fields'};
  }

  const sql = `INSERT INTO allergies (name)
               VALUES (?)`;
  const params = [name];
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return {error: 'Something went wrong with executing the query'};
  }
  return {message: 'New allergy created'};
}

const listAllergiesByProductId = async (productId) => {
  const sql = `SELECT DISTINCT allergies.name as allergy_names
        FROM productToIngredient
        LEFT JOIN Ingredients ON Ingredients.id = productToIngredient.ingredient_id
        LEFT JOIN ingredientsToAllergy ON ingredientsToAllergy.ingredient_id = Ingredients.id
        LEFT JOIN allergies ON allergies.id = ingredientsToAllergy.allergy_id
        WHERE productToIngredient.product_id = ?`;

  const params = [productId];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.length === 0) {
    return false;
  }
  return rows.map(row => row.allergy_names).filter(name => name !== null);
}


const getAllergyByIngredientId = async (ingredientId) => {
  const sql = `SELECT allergies.name
               FROM ingredientsToAllergy
               LEFT JOIN allergies ON allergies.id = ingredientsToAllergy.allergy_id
               WHERE ingredientsToAllergy.ingredient_id = ?`;
  const params = [ingredientId];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.length === 0) {
    return false;
  }
  return rows.map(row => row.name);

}


const addIngredientToAllergy = async (allergies, id) => {
  console.log('allergies', allergies, 'id', id)
  for (const allergy of allergies) {
    const sql = `INSERT INTO ingredientsToAllergy (allergy_id, ingredient_id)
               VALUES (?, ?)`;
    const params = [allergy, id];
    const rows = await promisePool.execute(sql, params);
    if (rows[0].affectedRows === 0) {
      return {error: 'Something went wrong with executing the query'};
    }
  }
  return {message: 'All products allergies added'};

}


export {
  getAllAlleries,
  createAllergy,
  listAllergiesByProductId,
  getAllergyByIngredientId,
  addIngredientToAllergy
}
