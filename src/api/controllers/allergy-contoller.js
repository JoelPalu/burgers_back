import {
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



// const postAllergyByArray = async (req, res) => {
//   const response = await (getAllAlleries());
//   const allergies_id = [];
//   const allergies = req.body.array.split(", ");
//   const productId = req.body.id;
//   for (const allergy of allergies) {
//     if (!response.find(a => a.name === allergy)) {
//       return res.status(400).json({error: 'Allergy does not exist or is misspelled. Add the allergy to database.'});
//     }
//     allergies_id.push(response.find(a => a.name === allergy).id);
//   }
//
//   const responseAdd = await (addProductToAllergy(allergies_id, productId));
//
//   return res.status(200).json(allergies_id);
// }

export {
  getAllergies,
  postAllergy,
  getAllergyByProductId
}
