import express from 'express';
import { getPurchases, createPurchase, getPurchaseStats, deletePurchase, updatePurchase } from '../controllers/purchase.js';

const router = express.Router();

router.get('/', getPurchases);
router.post('/', createPurchase);
router.get('/stats', getPurchaseStats);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

export default router;
