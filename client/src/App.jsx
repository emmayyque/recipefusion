import React, { useEffect, useState } from "react";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import AdminDashboard from "./Components/Dashboards/AdminDashboard";
import UserTable from "./Components/Dashboards/Users";
import ReviewsTable from "./Components/Dashboards/ReviewsTable";
import RecipeTable from "./Components/Dashboards/RecipeTable";
import LandingPage from "./Components/LandingPage/LandingPage";
import UserDashboard from "./Components/Dashboards/UserDashboard";
import SearchRecipe from "./Components/Dashboards/SearchRecipe";
import RecipeDetails from "./Components/Dashboards/RecipeDetailPage";
import IngredientSearch from "./Components/Dashboards/IngredSearch";
import SaveRecipes from "./Components/Dashboards/SavedRecipes";
import SearchPage from "./Components/Dashboards/SearchPage";
import UserProfile from "./Components/Dashboards/UserProfile";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import ProtectedRoute from "./utils/ProtectedRoutes";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import Loader from "./Components/Loader";

function Layout() {
 const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <div>
        <Routes>
          <Route path="*" element={<LandingPage />} />

          
          <Route path="/admindashboard" element={ <AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>}  />
          <Route path="/admindashboard/users" element={<AdminProtectedRoute> <UserTable /> </AdminProtectedRoute>} />
          <Route path="/admindashboard/recipes" element={<AdminProtectedRoute><RecipeTable /></AdminProtectedRoute>} />
          <Route path="/admindashboard/reviews" element={<AdminProtectedRoute><ReviewsTable /></AdminProtectedRoute>} /> 

          <Route path="/userdashboard" element={ <ProtectedRoute><UserDashboard/></ProtectedRoute>  } />
          <Route path="/searchrecipe" element={<ProtectedRoute><SearchRecipe /></ProtectedRoute>} /> 
          <Route path="/recipe/:id"  element={<ProtectedRoute><RecipeDetails /></ProtectedRoute>} /> 
          <Route path="/search-by-ingredients" element={<ProtectedRoute><IngredientSearch /></ProtectedRoute>} />
          <Route path="/userdashboard/savedrecipes" element={<ProtectedRoute><SaveRecipes /></ProtectedRoute>} /> 
          <Route path="/userdashboard/searchpage" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />  
          <Route path="/userdashboard/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> 

          <Route path="/loader" element={<Loader />} /> 
          
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
  );
}

function App() {
   
  return  (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;