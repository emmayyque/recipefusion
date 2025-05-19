require("dotenv").config();
const mongoose = require("mongoose");
const Recipe = require("./models/recipe");

const unseedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await Recipe.deleteMany({});
    console.log(`Deleted ${result.deletedCount} recipes.`);

    process.exit();
  } catch (error) {
    console.error("Error during unseeding:", error.message);
    process.exit(1);
  }
};

unseedRecipes();
