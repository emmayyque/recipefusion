import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import * as Icons from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import "./LandingPage.css";
import contactsvg from "../../assets/Images/contact.svg";
import footersvg from "../../assets/Images/footer1.svg";
import footersvg1 from "../../assets/Images/footer.svg";
import axios from "axios";
import Loader from "../Loader";
const baseURL = import.meta.env.VITE_NODE_URL;
import Swal from "sweetalert2";

function LandingPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const API_URL = `https://api.spoonacular.com/recipes/random?number=15&apiKey=${
    import.meta.env.VITE_FOOD_API
  }`;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(API_URL);

        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !subject || !message) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Fields",
      text: "Please fill in all fields.",
    });
    return;
  }

  try {
    setLoading(true);

    const { data } = await axios.post(`${baseURL}/api/contact/contact-email`, {
      name,
      email,
      subject,
      message,
    });

    form.reset();
    setLoading(false); // hide loader before showing alert

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    const errorMsg =
      err.response?.data?.error ||
      "Failed to send message. Please try again.";

    setLoading(false); // hide loader before showing alert

    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: errorMsg,
    });
  }
};


 
  return (
    
    <div className="landingPage">
    {loading && (
        <Loader />
    )}
      <a id="top"></a>

      <header>
        <Navbar />
      </header>

      {/*hero */}
      <div className="heroPageContainer" id="home">
        <div className="hero-container" data-aos="fade-up">
          <h1 className="hero-heading">
            Welcome to <span className="RF">Recipe Fusion</span>
          </h1>
          <h2 className="hero-h2" data-aos="fade-up" data-aos-delay="200">
            DELICIOUS RECIPES
          </h2>
          <p className="hero-text" data-aos="fade-up" data-aos-delay="200">
            Explore the finest recipes crafted for your taste.
          </p>
          <div className="btns" data-aos="fade-up" data-aos-delay="200">
            <button className="btn-explore">Explore now</button>
          </div>
        </div>
      </div>

      {/*why-us*/}
      <div className="why-choose-us" id="why-us">
        <h2 className="section-title" data-aos="fade-up">
          WHY CHOOSE US?
        </h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Discover why Recipe Fusion is the best choice for food lovers!
        </p>

        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <Icons.FaLeaf className="icons-colored" />
            <h3>Fresh Ingredients</h3>
            <p>We ensure only the freshest and highest quality ingredients.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <Icons.FaGlobe className="icons-colored" />
            <h3>Wide Variety</h3>
            <p>Thousands of recipes from different cuisines and cultures.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <Icons.FaHeartPulse className="icons-colored" />
            <h3>Healthy & Nutritious</h3>
            <p>Balanced, wholesome meals for a healthy lifestyle.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <Icons.FaBook className="icons-colored" />
            <h3>Easy-to-Follow</h3>
            <p>Step-by-step guidance, even for beginners.</p>
          </div>
        </div>
      </div>
      {/*banner */}
      <div className="quote-banner" id="banner">
        <h2 className="banner-heading">Cooking is an art Make it delicious!</h2>
        <p>Explore what you want</p>
      </div>

      {/*popular recipes */}
      <div className="popular-recipes" id="popularRecipes" data-aos="fade-up">
        <h2 className="section-title" data-aos="fade-up" data-aos-delay="100">
          Popular Recipes
        </h2>

        
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
          </div>
        
          <div className="recipes-grid" data-aos="fade-up" data-aos-delay="300">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                />
                <h3 className="recipe-title">{recipe.title}</h3>
                <button
                  className="btn-explore"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        
      </div>

      {/*recipe-info mdal*/}
      {selectedRecipe && (
        <div className="modal-overlay-container">
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">{selectedRecipe.title}</h2>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="modal-image"
              />
              <h3>Ingredients:</h3>
              <ul className="plain-text">
                {selectedRecipe.extendedIngredients.map((ingredient, index) => (
                  <li key={index}>{ingredient.original}</li>
                ))}
              </ul>
              <h3>Instructions:</h3>
              <ol className="plain-text">
                {selectedRecipe.analyzedInstructions.length > 0 ? (
                  selectedRecipe.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number}>{step.step}</li>
                  ))
                ) : (
                  <p className="plain-text">No instructions available.</p>
                )}
              </ol>
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
      {/*banner */}
      <div className="quote-banner" id="banner">
        <h2 className="banner-heading">Join the Flavor Revolution!</h2>
        <p>Share, learn, and cook with a community of food lovers</p>
      </div>

      {/*contact us */}

      <section
        className="contact-section"
        id="contact-section"
        data-aos="fade-up"
      >
        <h2 className="section-title" data-aos="fade-up" data-aos-delay="200">
          Contact Us
        </h2>

        <div
          className="contact-container"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="contact-svg" data-aos="zoom-in" data-aos-delay="300">
            <img src={contactsvg} alt="Contact" />
          </div>

          <div className="contact-form" data-aos="fade-up" data-aos-delay="400">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  
                />
              </div>
              <input
                name="subject"
                type="text"
                placeholder="Subject"
                
              />
              <textarea
                name="message"
                placeholder="Message"
                rows="5"
                
              ></textarea>
              <button type="submit" className="btn-explore" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Recipe Fusion</h2>
              <p>Cooking made simple & delicious</p>
              <div className="footer-image">
                <img src={footersvg} style={{ marginTop: "20px" }} />
              </div>
            </div>
          </div>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                {" "}
                <a href="#home">
                  {" "}
                  <Icons.FaHouse className="icons-colored" /> Home{" "}
                </a>
              </li>
              <li>
                {" "}
                <a href="#why-us">
                  <Icons.FaCircleInfo className="icons-colored" /> Why Choose Us
                </a>
              </li>
              <li>
                {" "}
                <a href="#popularRecipes">
                  <Icons.FaUtensils className="icons-colored" /> Recipes
                </a>
              </li>
              <li>
                {" "}
                <a href="#contact-section">
                  <Icons.FaPhone className="icons-colored" /> Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-image">
            <img src={footersvg1} />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Recipe Fusion. All Rights Reserved.</p>
        </div>
      </footer>
      <a href="#top" id="topButton">
        {" "}
        <Icons.FaArrowUp className="icons" />{" "}
      </a>
    </div>
  );
}

export default LandingPage;
