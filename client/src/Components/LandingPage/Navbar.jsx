import { useState } from "react";
import * as Icons from 'react-icons/fa6'
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import "./LandingPage.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-heading"><span>RECIPE</span> FUSION</div>
        <ul className="nav-links">
          <li><Link to="home" smooth={true} duration={500}>Home</Link></li>
          <li><Link to="why-us" smooth={true} duration={500}>Why Us</Link></li>
          <li><Link to="popularRecipes" smooth={true} duration={500} offset={-100}>Recipes</Link></li>
          <li><Link to="contact-section" smooth={true} duration={500} offset={-100}>Contact Us</Link></li>
        </ul>
        <button className="btn-loginn" onClick={() => navigate('/login')}>Login</button>

        <button className="menu-toggle" onClick={toggleSidebar}>
          <Icons.FaBars className="icons-colored"/>
        </button>


        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <ul className="sidebar-links">
            <li><Link to="home" smooth={true} duration={500} onClick={toggleSidebar}><Icons.FaHouse title="Home" /></Link></li>
            <li><Link to="why-us" smooth={true} duration={500} onClick={toggleSidebar}><Icons.FaCircleQuestion title="Why Us" /></Link></li>
            <li><Link to="popularRecipes" smooth={true} duration={500} offset={-100} onClick={toggleSidebar}><Icons.FaUtensils title="Popular Recipes" /></Link></li>
            <li><Link to="contact-section" smooth={true} duration={500} offset={-100} onClick={toggleSidebar}><Icons.FaEnvelope title="Contact Us" /></Link></li>
            <li onClick={() => { navigate('/login'); toggleSidebar(); }}><Icons.FaUser title="Login" /></li>
            
            <li onClick={toggleSidebar}><Icons.FaXmark title="Close" /></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
