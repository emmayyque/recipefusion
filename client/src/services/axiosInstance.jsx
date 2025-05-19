import axios from 'axios'
const baseURL = import.meta.env.VITE_NODE_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'multipart/form-data', // for FormData
    // Authorization: Bearer ${token}, // if needed
  },
  withCredentials: true, // optional: for cookies
});

export default axiosInstance