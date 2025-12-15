import {
  createIngredient,
  getAllIngredients, listIngredientsByProductId, ProductToIngredient
} from "../models/ingredient-model.js";
import {addIngredientToAllergy} from "../models/allergy-model.js";
import {getAllergies, postIngredientToAllergy} from "./allergy-contoller.js";

const getIngredients = async (req, res) => {
  const response = await (getAllIngredients());
  !response.error ? res.json(response) : res.status(500).json(response);
}

const postIngredient = async (req, res) => {
  let response = await (createIngredient(req.body));
  if (req.body.allergies){
      response = await (postIngredientToAllergy(req.body, res , response.id));
  }

  !response.error ? res.json(response) : res.status(500).json(response);

}

const addProductToIngredient = async (productId, ingredients) => {
  ingredients = ingredients.replace(/\[/g, '').replace(/]/g, '').split(',');

  for (const ingredient of ingredients) {
    const responseAdd = await (ProductToIngredient(productId, ingredient));
    if (responseAdd.error) {
      return false;
    }
  }

  return true;

}

const getIngredientsByProductId = async (req, res) => {
  const response = await listIngredientsByProductId(req.params.id);
  if (response.error) {
    return {message: 'No ingredients found'};
  }
  res.json(response);
}




export {
  getIngredients,
  postIngredient,
  addProductToIngredient,
  getIngredientsByProductId
}
