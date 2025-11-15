import axios from "axios";

// Environment variable मधून Base URL मिळवणे
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("🔗 API Base URL:", API_BASE_URL);


// Create an instance with the base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
});

// Request Interceptor: Token जोडण्यासाठी
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401/403 त्रुटी हाताळण्यासाठी
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      // Token हटवा आणि Login page वर redirect करा
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Export the configured instance
export default axiosInstance;