import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:10000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🚀 TOKEN BEING SENT:", token);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;