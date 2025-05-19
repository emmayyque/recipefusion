require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const FetchedRecipe = require("./models/recipe");

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const totalToFetch = 50;
    const batchSize = 10;

    for (let offset = 0; offset < totalToFetch; offset += batchSize) {
      const searchResponse = await axios.get(
        "https://api.spoonacular.com/recipes/complexSearch",
        {
          params: {
            apiKey: process.env.FOOD_API,
            number: batchSize,
            offset,
          },
        }
      );

      const recipes = searchResponse.data.results;

      for (const item of recipes) {
        const fullInfoResponse = await axios.get(
          `https://api.spoonacular.com/recipes/${item.id}/information`,
          {
            params: {
              apiKey: process.env.FOOD_API,
            },
          }
        );

        const recipeData = fullInfoResponse.data;

        const newRecipe = new FetchedRecipe({
          name: recipeData.title,
          image: recipeData.image,
          category: Array.isArray(recipeData.dishTypes) && recipeData.dishTypes.length > 0
            ? recipeData.dishTypes[0]
            : "General",
          description: recipeData.summary?.replace(/<[^>]*>/g, '') || "No description available.",
          ingredients: Array.isArray(recipeData.extendedIngredients)
            ? recipeData.extendedIngredients.map(ing => ing.original)
            : [],
          steps: Array.isArray(recipeData.analyzedInstructions) && recipeData.analyzedInstructions.length > 0
            ? recipeData.analyzedInstructions[0].steps.map(step => step.step)
            : [],
        });

        await newRecipe.save();
        console.log(`Saved: ${newRecipe.name}`);
      }
    }

    console.log("Seeding completed.");
    process.exit();
  } catch (error) {
    console.error("Error during seeding:", error.message);
    process.exit(1);
  }
};

seedRecipes();
