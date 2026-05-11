import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import recipeRoutes from './routes/recipe.js';
import mealPickRoutes from './routes/mealPick.js';
import shoppingListRoutes from './routes/shoppingList.js';
import purchaseRoutes from './routes/purchase.js';
import favoriteRoutes from './routes/favorite.js';

app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-picks', mealPickRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use(express.static(path.join(path.resolve(), 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'public', 'index.html'));
});

export default app;
