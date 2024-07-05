import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error response status is 401 and there's no previous retry attempt
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        localStorage.clear("token");
        alert("Session expired, please login again.");
        window.location.replace("/login");
        return;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Handle refresh token error (e.g., redirect to login page)
        // You may also choose to logout user or handle the error as per your app's requirements
        throw refreshError;
      }
    }

    // Return error if it's not a 401 status or refresh failed
    return Promise.reject(error);
  }
);

export default axiosInstance;
