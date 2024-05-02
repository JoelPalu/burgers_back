import {fetchRestaurants} from "../models/restaurant-model.js";


const getRestaurants = async (req, res) => {
  const response = await (fetchRestaurants());
  !response.error ? res.json(response) : res.status(500).json(response);

};


export {getRestaurants};
