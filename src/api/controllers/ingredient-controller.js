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
      response = await (postIngredientToAllergy(req.body.allergies, response, res));
  }

  !response.error ? res.json({response}) : res.status(500).json(response);

}

const addProductToIngredient = async (productId, ingredients) => {
  const response = await (getAllIngredients());
  if (response.error) {
    return response;
  }
  const ingredients_id = [];
  ingredients.toLowerCase();
  ingredients = ingredients.replace(/"/g, '');
  ingredients = ingredients.replace(/ /g, '');
  ingredients = ingredients.split(",");

  for (const ingredient of ingredients) {
    console.log('ingredient', ingredient)
    if (!response.find(i => i.name === ingredient)) {
      return {error: 'Ingredient does not exist or is misspelled. Add the ingredient to database.'};
    }
    ingredients_id.push(response.find(i => i.name === ingredient).id);
  }

  console.log('ingredients_id', ingredients_id, productId)
  for (const ingredient of ingredients_id) {
    const responseAdd = await (ProductToIngredient(productId, ingredient));
    if (responseAdd.error) {
      return responseAdd;
    }
  }

  return {message: 'All products ingredients added'}

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
