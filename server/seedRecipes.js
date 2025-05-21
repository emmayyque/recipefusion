require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const FetchedRecipe = require("./models/recipe");

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const totalToFetch = 500;
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
        try {
          const fullInfoResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${item.id}/information`,
            {
              params: {
                apiKey: process.env.FOOD_API,
              },
            }
          );

          const recipeData = fullInfoResponse.data;

          // Debug logging
          console.log(
            `Fetching recipe ID: ${item.id}, Title: ${recipeData.title}`
          );

          const ingredients = Array.isArray(recipeData.extendedIngredients)
            ? recipeData.extendedIngredients.map((ing) => ing.original)
            : [];

          if (ingredients.length === 0) {
            console.warn(`No ingredients found for: ${recipeData.title}`);
          }

          const steps =
            Array.isArray(recipeData.analyzedInstructions) &&
            recipeData.analyzedInstructions.length > 0 &&
            Array.isArray(recipeData.analyzedInstructions[0].steps)
              ? recipeData.analyzedInstructions[0].steps.map(
                  (step) => step.step
                )
              : [];

          if (steps.length === 0) {
            console.warn(`No steps found for: ${recipeData.title}`);
          }

          const newRecipe = new FetchedRecipe({
            name: recipeData.title,
            image: recipeData.image,
            category:
              Array.isArray(recipeData.dishTypes) &&
              recipeData.dishTypes.length > 0
                ? recipeData.dishTypes[0]
                : "General",
            description:
              recipeData.summary?.replace(/<[^>]*>/g, "") ||
              "No description available.",
            ingredients,
            steps,
          });

          await newRecipe.save();
          console.log(`Saved: ${newRecipe.name}`);

          // Delay to avoid rate limit (1 second)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (innerError) {
          console.error(
            `Failed to process recipe ID ${item.id}:`,
            innerError.message
          );
        }
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
