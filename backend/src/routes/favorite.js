import express from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favorite.js';

const router = express.Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:recipeId', removeFavorite);
router.get('/check/:recipeId', checkFavorite);

export default router;