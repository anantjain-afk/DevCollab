import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before each request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized error (e.g., clear localStorage and redirect to login)
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden error
          console.error("Forbidden access");
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
