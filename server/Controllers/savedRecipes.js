const express = require("express");
const router = express.Router();
const SavedRecipe = require("../models/SavedRecipe");

// Save a recipe
router.post("/saved-recipes", async (req, res) => {
  const { userId, recipeId, title, image } = req.body;

  if (!userId || !recipeId || !title || !image) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existing = await SavedRecipe.findOne({ userId, recipeId });
    if (existing) {
      return res.status(409).json({ message: "Recipe already saved." });
    }

    const savedRecipe = new SavedRecipe({ userId, recipeId, title, image });
    await savedRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error saving recipe", error: err });
  }
});

// Get all saved recipes for a user
router.get("/saved-recipes/:userId", async (req, res) => {
  try {
    const recipes = await SavedRecipe.find({ userId: req.params.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
});

// Delete a saved recipe for a user
router.delete("/saved-recipes/:userId/:recipeId", async (req, res) => {
  try {
    await SavedRecipe.findOneAndDelete({
      userId: req.params.userId,
      recipeId: req.params.recipeId,
    });
    res.json({ message: "Recipe removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err });
  }
});

module.exports = router;
