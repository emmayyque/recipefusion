const mongoose = require("mongoose");

const savedRecipeSchema = new mongoose.Schema({
  userId: { type: String, required: true, },
  recipeId: { type: Number, required: true, },
  title: { type: String,required: true, },
  image: {type: String, required: true, },
}, { timestamps: true });

savedRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model("SavedRecipe", savedRecipeSchema);
