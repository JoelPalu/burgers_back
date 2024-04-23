import {
  getAllCategories,
  newCategory,
  productToCategory,
  listCategoriesByProductId
} from "../models/category-model.js";


const getCategories = async (req, res) => {
  const response = await getAllCategories();
  !response.error ? res.json(response) : res.status(500).json(response);
}

const postCategory = async (req, res) => {
  const response = await newCategory(req.body);
  !response.error ? res.json(response) : res.status(500).json(response);
}

const addProductToCategory = async (product_id, categories) => {

  const response = await (getAllCategories());
  if (response.error) {
    return response;
  }
  console.log(response)
  const categories_id = [];
  categories.toLowerCase();
  categories = categories.replace(/"/g, '');
  categories = categories.replace(/ /g, '');
  categories = categories.split(",");

  for (const category of categories) {
    console.log('category', category)
    if (!response.find(i => i.name === category)) {

      return {error: 'Category does not exist or is misspelled. Add the category to database.'};
    }
    categories_id.push(response.find(i => i.name === category).id);
  }
  console.log('categories_id', categories_id)
  for (const id of categories_id) {
    console.log('id', id, 'product_id', product_id)
    const responseAdd = await (productToCategory(product_id, id));
    if (responseAdd.error) {
      return responseAdd;
    }
  }

  return {message: 'All products categories added'}
}

const getCategoriesByProductId = async (req, res) => {
  const response = await listCategoriesByProductId(req.params.id);
  if (response.error) {
    return {message: 'No categories found'};
  }
  res.json(response);
}

export {getCategories, postCategory, addProductToCategory, getCategoriesByProductId};
