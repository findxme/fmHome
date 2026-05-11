import express from 'express';
import { getShoppingList, buildShoppingList, updateShoppingItems, addShoppingItem, deleteShoppingItem, completeShoppingList } from '../controllers/shoppingList.js';

const router = express.Router();

router.get('/', getShoppingList);
router.post('/build', buildShoppingList);
router.put('/items', updateShoppingItems);
router.post('/item', addShoppingItem);
router.delete('/item/:id', deleteShoppingItem);
router.post('/complete', completeShoppingList);

export default router;
