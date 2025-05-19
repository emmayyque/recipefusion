import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_NODE_URL

const IngredientSearch = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_URL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${import.meta.env.VITE_FOOD_API}&number=20`;
      const response = await axios.get(API_URL);
      setRecipes(response.data);

     
      await axios.post(
        `${baseURL}/api/seachHistory/add-search`,
        {
          query: ingredients,
          type: "ingredients",
          filters: null,
        },
        { withCredentials: true } 
      );

    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="search-container">
      <h2 className="title">Search Recipes by Ingredients</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="loading-text">Loading...</p>}

      <div className="recipe-results">
        {recipes.length > 0 && (
          <ul className="recipe-list">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item" onClick={() => handleRecipeClick(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <p className="recipe-title">{recipe.title}</p>
                <p className="used-ingredients">✅ Used: {recipe.usedIngredientCount}</p>
                <p className="missed-ingredients">❌ Missing: {recipe.missedIngredientCount}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IngredientSearch;
