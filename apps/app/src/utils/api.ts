import axios from "axios";

// console.log("API URL:", import.meta.env.VITE_REACT_APP_API_URL);

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:80/api";

// console.log("Using API URL:", API_URL);

const baseApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const authApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

authApi.interceptors.request.use((request) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

export { baseApi, authApi };
