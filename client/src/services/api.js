import axios from "axios";

// Change this to your Render backend URL
const API = axios.create({
  baseURL: "https://smart-finanz-server.onrender.com/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
