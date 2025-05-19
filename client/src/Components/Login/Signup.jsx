import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";
import signupImage from "../../assets/Images/signup.svg";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaLock } from "react-icons/fa";
const baseURL = import.meta.env.VITE_NODE_URL

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, phone, gender, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address (e.g., user@example.com)",
      });
    }

    const phoneRegex = /^(\+?\d{10,15})$/;
    if (!phoneRegex.test(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Enter a valid phone number (e.g., +923001234567 or 03001234567)",
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 8 characters long and contain at least one capital letter and one number.",
      });
    }

    try {
      const response = await axios.post(`${baseURL}/api/auth/register`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: response.data.message,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div id="logsign" className="login-signup-container">
      <header className="navbar">
        <h1 className="nav-heading"><span>Recipe</span>Fusion</h1>
        <div className="nav-buttons">
          <button className="btn-login" onClick={() => navigate("/home")}>
            Home
          </button>
        </div>
      </header>

      <div className="auth-container">
        <div className="rightSection">
          <div className="logo-container">
            <h1 className="section-title">Recipe Fusion</h1>
          </div>
          <img src={signupImage} alt="Signup Illustration" />
        </div>

        <div className="leftSection">
          <h2 className="section-title">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <FaUser className="icons-colored" />
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Username"
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <FaEnvelope className="icons-colored" />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <FaPhone className="icons-colored" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Phone"
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <FaVenusMars className="icons-colored" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-container">
              <FaLock className="icons-colored" />
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-login">
              Sign Up
            </button>
          </form>

          <p className="form-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
