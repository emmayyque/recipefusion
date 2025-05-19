import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import profileimg from "../../assets/Images/profile.svg";
import * as Icons from "react-icons/fa6";
import Sidebar from "./UserSidebar";
import axios from "axios";
const baseURL = import.meta.env.VITE_NODE_URL

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const storedUser = {
      username: localStorage.getItem("username") || "",
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || "",
      gender: localStorage.getItem("gender") || "",
    };

    setUser(storedUser);
    setEditData(storedUser);
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/api/users/update-user`, 
        editData,
        { withCredentials: true }
      );

      const updatedUser = res.data.user;

      localStorage.setItem("email", updatedUser.email);
      localStorage.setItem("phone", updatedUser.phone);
      localStorage.setItem("gender", updatedUser.gender);
      localStorage.setItem("username", updatedUser.username); 

      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-card">
          <img src={profileimg} alt="Profile" className="profile-img" />
          <div className="profile-info">
            <p><Icons.FaUser className="icons-colored" /> <strong>Username:</strong> {user.username}</p>
            <p><Icons.FaEnvelope className="icons-colored" /> <strong>Email:</strong> {user.email}</p>
            <p><Icons.FaPhone className="icons-colored" /> <strong>Phone:</strong> {user.phone}</p>
            <p><Icons.FaMars className="icons-colored" /> <strong>Gender:</strong> {user.gender}</p>
            
          </div>
          <button className="btn-explore" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>

        {editMode && (
          <div className="edit-modal">
            <div className="modal-content">
              <h3>Edit Profile</h3>

              <label>Username:</label>
              <input type="text" name="username" value={editData.username} onChange={handleChange} />

              <label>Email:</label>
              <input type="email" name="email" value={editData.email} onChange={handleChange} />

              <label>Phone Number:</label>
              <input type="tel" name="phone" value={editData.phone} onChange={handleChange} />

              <label>Gender:</label>
              <select name="gender" value={editData.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <label>New Password:</label>
              <input type="password" name="password" onChange={handleChange} />


              <div className="modal-buttons">
                <button className="save-btn" onClick={saveChanges}>Save</button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
