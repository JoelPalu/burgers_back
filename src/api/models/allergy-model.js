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


// const addIngredientToAllergy = async (allergies, id) => {
//   for (const allergy of allergies) {
//     const sql = `INSERT INTO products_allergies (allergy_id, product_id)
//                VALUES (?, ?)`;
//     const params = [allergy, id];
//     const rows = await promisePool.execute(sql, params);
//     if (rows[0].affectedRows === 0) {
//       return {error: 'Something went wrong with executing the query'};
//     }
//   }
//   return {message: 'All products allergies added'};
//
// }


export {
  getAllAlleries,
  createAllergy,
}
