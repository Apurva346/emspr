


// import axios from "axios";

// // 💡 बदल १: Environment variable (.env मधून) Base URL मिळवणे
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Create an instance with the base URL
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL, // ✅ येथे .env मधील URL वापरली जाईल
// });

// // Interceptor to automatically attach the JWT token from localStorage
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     // JWT token मध्ये 'Bearer ' नंतर space (जागा) आहे, हे बरोबर आहे.
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Interceptor to handle Authentication errors (401/403)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // ✅ बदल २: 403 (Forbidden) आणि 401 (Unauthorized) दोन्ही हाताळले.
//     if (error.response && (error.response.status === 403 || error.response.status === 401)) {
//       // Token हटवा आणि Login page वर redirect करा
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// // Export the configured instance for use across the application
// export default axiosInstance;

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