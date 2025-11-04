import {fetchOrgs} from '../models/org-model.js';


const getOrgs = async (req, res) => {
  const response = await fetchOrgs();
  !response.error ? res.json(response) : res.status(500).json(response);

};

export {getOrgs};
