import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DataTable from "./DataTable";
import * as Icons from "react-icons/fa";
import "./DataTable.css";
import axios from "axios";
const baseURL = import.meta.env.VITE_NODE_URL

const userColumns = [
  { label: "Username", key: "username" },
  { label: "Email", key: "email" },  

];

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/users/all-users`, { withCredentials: true })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: `Are you sure you want to delete ${user.username}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${baseURL}/api/users/delete-user/${user.username}`,
            { withCredentials: true }
          ); // Ensure cookies are sent
          if (response.status === 200) {
            Swal.fire("Deleted!", response.data.message, "success");
            setUsers((prevUsers) =>
              prevUsers.filter((u) => u.username !== user.username)
            );
          } else {
            Swal.fire(
              "Error",
              response.data.message || "Failed to delete user.",
              "error"
            );
          }
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to delete user.",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditData({ ...user });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/api/users/update-user`,
        editData,
        {
          withCredentials: true,
        }
      );

      Swal.fire("Success", "User updated successfully!", "success");

      setUsers((prev) =>
        prev.map((u) => (u.email === editData.email ? res.data.user : u))
      );
      setEditUser(null);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update user.",
        "error"
      );
    }
  };

  return (
    <>
      <DataTable
        title="Users"
        data={users}
        columns={userColumns}
        actions={[
          { label: "View", icon: <Icons.FaEye />, onClick: handleView },
          { label: "Edit", icon: <Icons.FaEdit />, onClick: handleEdit },
          { label: "Delete", icon: <Icons.FaTrash />, onClick: handleDelete },
        ]}
        loading={loading}
      />

      {selectedUser && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.3rem", marginBottom: 15 }}>
              User Profile
            </h3>
            <p className="profile-attributes">
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p className="profile-attributes">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="profile-attributes">
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p className="profile-attributes">
              <strong>Gender:</strong> {selectedUser.gender}
            </p>
            <div className="modal-buttons">
              <button
                style={{ marginLeft: 100, marginTop: 15 }}
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit User</h3>

            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editData.username}
              onChange={handleEditChange}
            />

            <label>Email (read-only):</label>
            <input type="email" name="email" value={editData.email} readOnly />

            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={editData.phone}
              onChange={handleEditChange}
            />

            <label>Gender:</label>
            <select
              name="gender"
              value={editData.gender}
              onChange={handleEditChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <div className="modal-buttons">
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsersPage;
