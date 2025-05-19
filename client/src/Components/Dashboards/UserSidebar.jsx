import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fa6";
import "./Sidebar.css";

function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="admin-sidebar large-screen">
        <div className="logo">
          <h3 className="nav-heading">Recipe <span>Fusion</span></h3>
        </div>
        <ul className="menu">
          <li 
            className={location.pathname === "/userdashboard" ? "active" : ""}
            onClick={() => navigate("/userdashboard")}
          >
            <Icons.FaHouse className="icons-colored" /> Home
          </li>
          <li 
            className={location.pathname === "/userdashboard/searchpage" ? "active" : ""}
            onClick={() => navigate("/userdashboard/searchpage")}
          >
            <Icons.FaSearchengin className="icons-colored" /> Search any Recipe
          </li>
          <li 
            className={location.pathname === "/userdashboard/savedrecipes" ? "active" : ""}
            onClick={() => navigate("/userdashboard/savedrecipes")}
          >
            <Icons.FaBookmark className="icons-colored" /> Saved Recipes
          </li>
          <li 
            className={location.pathname === "/userdashboard/userprofile" ? "active" : ""}
            onClick={() => navigate("/userdashboard/userprofile")}
          >
            <Icons.FaUserLarge className="icons-colored" /> Profile
          </li>
          <li 
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => navigate("/login")}
          >
            <Icons.FaArrowRightFromBracket className="icons-colored" /> Logout
          </li>
        </ul>
      </div>

      <div className="admin-sidebar small-screen">
        <div className="logo">
          <h3 className="nav-heading" style={{fontSize:'16px', color:'#fff', letterSpacing:0, marginBottom:'10px'}}>Recipe Fusion</h3>
        </div>
        <ul className="menu">
          <li 
            className={location.pathname === "/userdashboard" ? "active" : ""}
            onClick={() => navigate("/userdashboard")}
          >
            <Icons.FaHouse className="icons-colored" />
          </li>
          <li 
            className={location.pathname === "/userdashboard/searchpage" ? "active" : ""}
            onClick={() => navigate("/userdashboard/searchpage")}
          >
            <Icons.FaSearchengin className="icons-colored" />
          </li>
          <li 
            className={location.pathname === "/userdashboard/savedrecipes" ? "active" : ""}
            onClick={() => navigate("/userdashboard/savedrecipes")}
          >
            <Icons.FaBookmark className="icons-colored" />
          </li>
          <li 
            className={location.pathname === "/userdashboard/userprofile" ? "active" : ""}
            onClick={() => navigate("/userdashboard/userprofile")}
          >
            <Icons.FaUserLarge className="icons-colored" />
          </li>
          <li 
            className={location.pathname === "/login" ? "active" : ""}
            onClick={() => navigate("/login")}
          >
            <Icons.FaArrowRightFromBracket className="icons-colored" />
          </li>
        </ul>
      </div>
    </>
  );
}

export default UserSidebar;
