import express from 'express';
import { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, getRandomRecipe } from '../controllers/recipe.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.get('/random/get', getRandomRecipe);

export default router;
