import promisePool from '../../utils/database.js';

const getAllCategories = async (req, res) => {
  const sql = `SELECT * FROM category`;
  const [rows] = await promisePool.execute(sql);
  if (rows.affectedRows === 0) {
    return {error: 'Something went wrong with executing the query'};
  }
  return rows
}


const newCategory = async (data, res) => {
  console.log(data)
  if (!data.name) {
    return {error: 'Name is required'};
  }
  try {
    const sql = `INSERT INTO category (name)
               VALUES (?)`;
    const params = [data.name];
    const rows = await promisePool.execute(sql, params);
    if (rows[0].affectedRows === 0) {
      return {error: 'Something went wrong with executing the query'};
    }
    return {message: 'New category created'};
  } catch (e) {
    return {error: 'Something went wrong with executing the query'};
  }

};

const productToCategory = async (productId, categoryId) => {
console.log('productId', productId, 'categoryId', categoryId)
  const sql = `INSERT INTO productToCategory (product_id, category_id)
               VALUES (?, ?)`;
  const params = [parseInt(productId), parseInt(categoryId)];
  const rows = await promisePool.execute(sql, params);
  if (rows[0].affectedRows === 0) {
    return {error: 'Something went wrong with executing the query'};
  }
  return {message: 'All products categories added'};
}

const listCategoriesByProductId = async (productId) => {
  const sql = `SELECT DISTINCT category.name FROM productToCategory
               JOIN category ON category.id = productToCategory.category_id
               WHERE productToCategory.product_id = ?`;

  const params = [productId];
  const [rows] = await promisePool.execute(sql, params);
  if (rows.length === 0) {
    return false;
  }
  return rows;

}


export {getAllCategories, newCategory, productToCategory, listCategoriesByProductId};
