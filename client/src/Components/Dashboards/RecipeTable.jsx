import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "./DataTable";
import * as Icons from "react-icons/fa6";
import "./DataTable.css";
const baseURL = import.meta.env.VITE_NODE_URL;

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${baseURL}/api/recipes/all-recipes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
        Swal.fire("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = (recipe) => {
    Swal.fire({
      title: `Are you sure you want to delete ${recipe.name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${baseURL}/api/recipes/delete-recipes/${recipe.name}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              },
            }
          );

          const data = await res.json();
          if (res.ok) {
            setRecipes((prev) => prev.filter((r) => r.name !== recipe.name));
            Swal.fire("Deleted!", data.message, "success");
          } else {
            Swal.fire(
              "Error",
              data.message || "Failed to delete recipe",
              "error"
            );
          }
        } catch (err) {
          console.error("Delete error:", err.message);
          Swal.fire("Error", "Failed to delete recipe", "error");
        }
      }
    });
  };

  const recipeColumns = [
    { label: "Recipe Name", key: "name" },
    { label: "Image", key: "image" },
    { label: "Category", key: "category" },
  ];

  const recipeActions = [
    {
      label: "View",
      icon: <Icons.FaEye />,
      onClick: (recipe) => setSelectedRecipe(recipe),
    },
    {
      label: "Delete",
      icon: <Icons.FaTrash />,
      onClick: handleDelete,
    },
  ];

  return (
    <>
      {/* DataTable */}
      <DataTable
        title="Recipes"
        data={recipes}
        columns={recipeColumns}
        actions={recipeActions}
        loading={loading}
      />

      {/* Modal */}
      {selectedRecipe && (
        <div className="modal-overlay-container">
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{selectedRecipe.name}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.name}
              className="modal-image"
            />
            

            {/* Ingredients */}
            <div>
              <h3>Ingredients:</h3>
              {selectedRecipe.ingredients &&
              selectedRecipe.ingredients.length > 0 ? (
                <ul>
                  {selectedRecipe.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                  ))}
                </ul>
              ) : (
                <p>No ingredients available.</p>
              )}
            </div>

            {/* Steps */}
            <div>
              <h3>Steps:</h3>
              {selectedRecipe.steps && selectedRecipe.steps.length > 0 ? (
                <ol>
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p>No steps available.</p>
              )}
            </div>

            <button
              className="btn-close"
              onClick={() => setSelectedRecipe(null)}
            >
              Close
            </button>
          </div>
        </div>
        </div>
      )}
    </>
  );
}

export default RecipesPage;
