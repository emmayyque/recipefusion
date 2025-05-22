import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./DataTable.css";
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_NODE_URL
import Loader from "../Loader";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    review: "",
    sentiment: "neutral",
  });

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${import.meta.env.VITE_FOOD_API}`
        );
        setRecipe(response.data);

        setReviewForm((prevForm) => ({
          ...prevForm,
          title: response.data.title,
        }));
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setError("Failed to load recipe details.");
      }
      setLoading(false);
    };
    fetchRecipeDetails();
  }, [id]);

  
  const getShoppingList = () => {
    if (recipe) {
      const ingredients = recipe.extendedIngredients.map(
        (ingredient) => ingredient.original
      );
      setShoppingList(ingredients);
    }
  };

  const saveRecipe = async () => {
    const userId = localStorage.getItem("userId"); 
    if (!userId) {
      Swal.fire("Not Logged In", "Please log in to save recipes.", "warning");
      return;
    }

    const newRecipe = {
      userId,
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
    };

    try {
      const response = await axios.post(
        `${baseURL}/api/savedRecipes/saved-recipes`,
        newRecipe,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Recipe Saved!",
          text: "This recipe has been saved to your account.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire("Already Saved", "This recipe is already saved.", "info");
      } else {
        Swal.fire("Error", "Could not save the recipe. Try again later.", "error");
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire("Not Logged In", "Please log in to submit a review.", "warning");
      return;
    }

    try {
      const reviewData = {
        userId,
        recipeId: recipe.id,
        title: reviewForm.title,
        review: reviewForm.review,
        sentiment: reviewForm.sentiment,
      };

      const res = await axios.post(
        `${baseURL}/api/reviews/add-review`,
        reviewData,
        { 
          withCredentials: true, 
        }
      );

      Swal.fire("Review Added", "Thanks for your feedback!", "success");
      setShowModal(false);
      setReviewForm({
        title: recipe.title, 
        review: "",
        sentiment: "neutral",
      });
    } catch (err) {
      console.error("Review submission failed", err);
      Swal.fire("Error", "Could not submit review. Try again.", "error");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return null;

  return (
    <div className="recipe-details-container">
      <h2>{recipe.title}</h2>

      <h3>Ingredients</h3>
      <ul className="ingredient-list">
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <ol className="instructions-list">
        {recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))
          : "No instructions available."}
      </ol>

      <button className="back-button" onClick={getShoppingList}>
        Get Shopping List
      </button>
      <button className="back-button" onClick={saveRecipe}>
        Save Recipe
      </button>
      <button className="back-button" onClick={() => setShowModal(true)}>
        Add Review
      </button>

      {shoppingList.length > 0 && (
        <div className="shopping-list-container">
          <h3>Shopping List</h3>
          <ul className="shopping-list-list">
            {shoppingList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/userdashboard" className="back-button">
        Back to Recipes
      </Link>

      {/* Review Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={reviewForm.title}
                style={{fontSize:16, color: "#000", backgroundColor: "#fff"}}
                readOnly
              />
              <textarea
                placeholder="Write your review"
                value={reviewForm.review}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, review: e.target.value })
                }
                required
              />
              <select
                value={reviewForm.sentiment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, sentiment: e.target.value })
                }
                style={{fontSize:16}}
                required
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-login">Submit</button>
                <button type="button" className="btn-login" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
