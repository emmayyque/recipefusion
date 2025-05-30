import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./DataTable.css";
import Swal from "sweetalert2";
const baseURL = import.meta.env.VITE_NODE_URL;
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
const [reviews, setReviews] = useState([]);
const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
            import.meta.env.VITE_FOOD_API
          }`
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
      const ingredients = recipe.extendedIngredients.map((ingredient) => ({
        name: ingredient.name,
        aisle: ingredient.aisle,
      }));

      ingredients.sort((a, b) => a.name.localeCompare(b.name));
      setShoppingList(ingredients);
    }
  };

  const downloadShoppingList = () => {
    const printContent = document.getElementById("printable-area").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
<html>
  <head>
    <title>Shopping List - ${recipe.title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        background-color: white;
        color: black;
        font-size: 16px;
        line-height: 1.5;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f0f0f0;
      }
      
      @page {
        margin: 20mm;
        size: A4 portrait;
      }
    </style>
  </head>
  <body>
    ${printContent}
  </body>
</html>
`);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
        Swal.fire(
          "Error",
          "Could not save the recipe. Try again later.",
          "error"
        );
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire(
        "Not Logged In",
        "Please log in to submit a review.",
        "warning"
      );
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

      await axios.post(`${baseURL}/api/reviews/add-review`, reviewData, {
        withCredentials: true,
      });

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

useEffect(() => {
  const fetchRecipeDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
          import.meta.env.VITE_FOOD_API
        }`
      );
      setRecipe(response.data);

      setReviewForm((prevForm) => ({
        ...prevForm,
        title: response.data.title,
      }));

      // Fetch reviews using Spoonacular recipe.id
      const reviewsRes = await axios.get(`${baseURL}/api/reviews/reviews/${id}`);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error fetching recipe or reviews:", error);
      setError("Failed to load recipe details.");
    }

    setLoading(false);
    setReviewsLoading(false);
  };

  fetchRecipeDetails();
}, [id]);



  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return null;

  return (
    <div className="recipe-details-container">
      <h2>{recipe.title}</h2>

      <h3>Ingredients</h3>
      <ul className="ingredient-list">
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={`${ingredient.id}-${ingredient.original}`}>
            {ingredient.original}
          </li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <ol className="instructions-list">
        {recipe.analyzedInstructions.length > 0
          ? recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={`${step.number}-${step.step}`}>{step.step}</li>
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

<h3>User Reviews</h3>
{reviewsLoading ? (
  <p>Loading reviews...</p>
) : reviews.length === 0 ? (
  <p className="no-reviews-text">No reviews yet.</p>
) : (
  <div className="review-carousel">
    {reviews.map((r) => (
  <div key={r._id} className={`review-card ${r.sentiment}`}>
    <div className="review-header">
      <span className="review-username">{r.userId?.username || "Anonymous"}</span>
      <span className={`review-sentiment ${r.sentiment}`}>{r.sentiment}</span>
    </div>

    <div className="review-rating">
      {[...Array(5)].map((_, i) => {
        let starsToFill = 0;
        if (r.sentiment === "positive") starsToFill = 5;
        else if (r.sentiment === "neutral") starsToFill = 3;
        else if (r.sentiment === "negative") starsToFill = 1;

        return (
          <span key={i} className={i < starsToFill ? "star filled" : "star"}>
            ★
          </span>
        );
      })}
    </div>

    <p className="review-text">"{r.review}"</p>
  </div>
))}

  </div>
)}





      {shoppingList.length > 0 && (
        <>
          <ul className="shopping-list-list">
            {shoppingList.map((item, index) => (
              <li key={`${item.name}-${item.aisle}-${index}`}>
                <span style={{ fontWeight: "600" }}>{item.name}</span>
                {item.aisle && <span> ({item.aisle})</span>}
              </li>
            ))}
          </ul>
          <button className="back-button" onClick={downloadShoppingList}>
            Download Grocery List (PDF)
          </button>
        </>
      )}

      <Link to="/userdashboard" className="back-button">
        Back to Recipes
      </Link>

      {/* Hidden printable area */}
      <div id="printable-area" style={{ display: "none" }}>
        <table>
          <thead>
            <tr>
              <th colSpan="3">GROCERY LIST OF {recipe.title.toUpperCase()}</th>
            </tr>
            <tr>
              <th>Item</th>
              <th>Purpose (Aisle)</th>
            </tr>
          </thead>
          <tbody>
            {shoppingList.map((item, index) => (
              <tr key={`${item.name}-${item.aisle}-${index}`}>
                <td>{item.name}</td>
                <td>{item.aisle || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                style={{ fontSize: 16, color: "#000", backgroundColor: "#fff" }}
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
                style={{ fontSize: 16 }}
                required
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-login">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-login"
                  onClick={() => setShowModal(false)}
                >
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
