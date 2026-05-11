import express from 'express';
import { getMealPicks, addMealPick, toggleMealPick, clearMealPicks } from '../controllers/mealPick.js';

const router = express.Router();

router.get('/', getMealPicks);
router.post('/', addMealPick);
router.put('/:id/toggle', toggleMealPick);
router.delete('/clear', clearMealPicks);

export default router;
