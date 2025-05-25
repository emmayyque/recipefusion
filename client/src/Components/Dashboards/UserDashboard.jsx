import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import Sidebar from "./UserSidebar";
import Loader from "../Loader"
import axios from "axios";
const baseURL = import.meta.env.VITE_NODE_URL;
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [searches, setSearches] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/api/auth/fetchuser`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.warn("User not found or unauthorized");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [searchRes, savedRes, recipeRes] = await Promise.all([
          axios.get(`${baseURL}/api/searchHistory/user-searches`, {
            params: { userId: user._id },
            withCredentials: true,
          }),
          axios.get(`${baseURL}/api/savedRecipes/saved-recipes/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(
            `https://api.spoonacular.com/recipes/random?number=8&apiKey=${import.meta.env.VITE_FOOD_API}`
          ),
        ]);

        setSearches(searchRes.data);
        setSavedRecipes(savedRes.data);
        setRecommendations(recipeRes.data.recipes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }} className="dashboard-main">
      <Sidebar />
      {loading ? (
        <div className="dashboard-loader-wrapper">
          <Loader />
        </div>
      ) : (
        <div className="dashboard-left">
          <div className="welcome-section">
            <h2>WELCOME BACK, {user.username}</h2>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <h3>{savedRecipes.length}</h3>
              <p>Saved Recipes</p>
            </div>
            <div className="stat-card">
              <h3>{searches.length}</h3>
              <p>Searches Made</p>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Searches</h3>
            <ul>
              {searches.map((search, idx) => (
                <li key={idx}>{search.query}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!loading && (
        <div className="dashboard-right">
          <ul className="recommended-list">
  {recommendations.map((recipe) => (
    <li key={recipe.id} className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-link">
        <img src={recipe.image} alt={recipe.title} />
        <p>{recipe.title}</p>
      </Link>
    </li>
  ))}
</ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
