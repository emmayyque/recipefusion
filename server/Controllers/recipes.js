const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// POST /api/recipes - Add a new recipe
router.post('/add-recipes', async (req, res) => {
  try {
    const { name, image, category, description, ingredients, steps } = req.body;

    if (!name || !image || !category || !description || !ingredients || !steps) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newRecipe = new Recipe({ name, image, category, description, ingredients, steps });
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully!', recipe: newRecipe });
  } catch (error) {
    console.error('Error adding recipe:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/recipes - Get all recipes
router.get('/all-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/recipes/:name - Get recipe by name
router.get('/getrecipes/:name', async (req, res) => {
  try {
    const recipeName = req.params.name;
    const recipe = await Recipe.findOne({ name: recipeName });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/recipes/:name - Delete recipe by name
router.delete('/delete-recipes/:name', async (req, res) => {
  try {
    const recipeName = req.params.name;
    const deletedRecipe = await Recipe.findOneAndDelete({ name: recipeName });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully!' });
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get('/recipes-stats', async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // sort by date ascending
    ]);

    // Format result to match chart needs
    const result = stats.map(item => ({
      date: item._id,
      count: item.count
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching recipe stats" });
  }
});

module.exports = router;
