import promisePool from '../../utils/database.js';

const fetchOrgs = async () => {
  const sql = 'SELECT * FROM organisation';

  const [rows] = await promisePool.execute(sql);
  return rows;
}

export {fetchOrgs};
