import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import Sidebar from "./UserSidebar";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = import.meta.env.VITE_NODE_URL;

const SaveRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axios
        .get(`${baseURL}/api/savedRecipes/saved-recipes/${userId}`, {
          withCredentials: true, 
        })
        .then((res) => setSavedRecipes(res.data))
        .catch(() => setSavedRecipes([]));
    }
  }, []);

  const removeRecipe = (recipeId) => {
    const userId = localStorage.getItem("userId");

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this recipe?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseURL}/api/savedRecipes/saved-recipes/${userId}/${recipeId}`, {
            withCredentials: true, 
          })
          .then(() => {
            setSavedRecipes((prev) =>
              prev.filter((r) => r.recipeId !== recipeId)
            );
            Swal.fire("Removed!", "The recipe has been removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to remove recipe.", "error");
          });
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        background: "#f9fafb",
      }}
    >
      <Sidebar />
      <div className="saved-recipes-container">
        <h2>Saved Recipes</h2>
        {savedRecipes.length === 0 ? (
          <p>No saved recipes.</p>
        ) : (
          <ul
            className="saved-recipe-list"
            style={{ padding: 0, listStyle: "none" }}
          >
            {savedRecipes.map((recipe) => (
              <li key={recipe.recipeId} className="saved-recipe-item">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="saved-recipe-image"
                />
                <div className="saved-recipe-info">
                  <h3>{recipe.title}</h3>
                  <button
                    onClick={() => removeRecipe(recipe.recipeId)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SaveRecipes;
