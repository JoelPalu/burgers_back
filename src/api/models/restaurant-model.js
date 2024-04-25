import promisePool from '../../utils/database.js';

const fetchRestaurants = async () => {
  const sql = 'SELECT * FROM restaurant';

  const [rows] = await promisePool.execute(sql);
  return rows;
}

export {fetchRestaurants};
