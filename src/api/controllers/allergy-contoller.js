import {
  addIngredientToAllergy,
  createAllergy,
  getAllAlleries,
  listAllergiesByProductId
} from "../models/allergy-model.js";


const getAllergies = async (req, res) => {
  const response = await (getAllAlleries());
  !response.error ? res.json(response) : res.status(500).json(response);
}

const postAllergy = async (req, res) => {
  const response = await (createAllergy(req.body));
  !response.error ? res.json(response) : res.status(500).json(response);

}

const getAllergyByProductId = async (req, res) => {
  const response = await listAllergiesByProductId(req.params.id);
  if (response.error) {
    return {message: 'No ingredients found'};
  }
  res.json(response);
}



const postIngredientToAllergy = async (req, res) => {
  console.log('req', req)
  const response = await (getAllAlleries());
  const allergies_id = [];
  let allergies = req.replace(/"/g, '');
  allergies = allergies.replace(/ /g, '');
  allergies = allergies.split(",");
  const ingredient_id = res.id;
  for (const allergy of allergies) {
    if (!response.find(a => a.name === allergy)) {
      return res.status(400).json({error: 'Allergy does not exist or is misspelled. Add the allergy to database.'});
    }
    allergies_id.push(response.find(a => a.name === allergy).id);
  }

  const responseAdd = await (addIngredientToAllergy(allergies_id, ingredient_id));

  return {message: 'Allergies added to ingredient'};
}

export {
  getAllergies,
  postAllergy,
  getAllergyByProductId,
  postIngredientToAllergy
}
