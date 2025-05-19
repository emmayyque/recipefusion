import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const baseURL = import.meta.env.VITE_NODE_URL

const AdminProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const resp = await axios.post(
        `${baseURL}/api/auth/fetchuser`,
        {},
        { withCredentials: true } 
      );

      if (resp.data.success) {
        setUser(resp.data.data);
      } else {
        console.log("User fetch failed");
      }
    } catch (err) {
      console.error("Axios error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== 1) {
    return <Navigate to="/userdashboard" />;
  }

  return children;
};

export default AdminProtectedRoute;
