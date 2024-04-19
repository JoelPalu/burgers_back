import promisePool from '../../utils/database.js';

const listAllProducts = async () => {
  const [rows] = await promisePool.query('SELECT * FROM Products');
  return rows;
};

const findProductById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM Products WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addProduct = async (product, file) => {
  const {name, ingredients, type, price, category} = product;
  !file ? (file = {name: null}) : file;

  console.log("product", product, "file", file);
  const sql = `INSERT INTO Products (name, price, image)
               VALUES (?, ?, ?)`;
  const data = [name, price, file.filename];
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {id: rows[0].insertId};
};


const removeProduct = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = connection.format('DELETE FROM Products WHERE id = ?', [
      id,
    ]);

    const [result] = await connection.execute(sql);

    if (result.affectedRows === 0) {
      return false;
    }

    // if no errors commit transaction
    await connection.commit();

    return {
      message: 'Product deleted',
    };
  } catch (error) {
    await connection.rollback();
    console.error('error', error.message);
    return false;
  } finally {
    connection.release();
  }
};

const updateProduct = async (product, id) => {
  const sql = promisePool.format(`UPDATE Products SET ? WHERE id = ?`, [
    product,
    id,
  ]);
  try {
    const rows = await promisePool.execute(sql);
    console.log('update Product', rows);
    if (rows[0].affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (e) {
    console.error('error', e.message);
    return false;
  }
};

export {
  listAllProducts,
  findProductById,
  addProduct,
  getProductByName,
  removeProduct,
  updateProduct,
};
