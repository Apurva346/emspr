// import React, { useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '../App.css'
// import { FaEye, FaEyeSlash } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'
// // Assuming 'logo' is not used, but keeping the import path for context
// import logo from '../assets/logo.png' 
// // FIX: Import the configured axios instance using a clear name like 'api'
// import api from './axiosconfig' 


// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [infoMessage, setInfoMessage] = useState(null); // Custom state for info messages/modals
//   const navigate = useNavigate();

//   // Custom handler to show a non-alert message for "Forgot Password"
//   const handleForgotPassword = () => {
//     setInfoMessage("Redirect to Forgot Password Page functionality is active.");
//     // Clear the message after a few seconds
//     setTimeout(() => setInfoMessage(null), 3000); 
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrors("");
//     setSuccess("");
//     setInfoMessage(null); // Clear any pending messages

//     try {
//       // FIX: Use the imported 'api' instance for the request
//       const response = await api.post("/login", { username, password });
      

//       // Get and store token
//       const token = response.data.token;
//       localStorage.setItem("token", token);

//       setSuccess("Login successful!");
//       navigate("/home");
//     } catch (err) {
//       if (err.response) {
//         // Display backend error message
//         setErrors(err.response.data.message);
//       } else {
//         // Display network/unexpected error
//         setErrors("An unexpected error occurred. Please try again later.");
//       }
//     }
//   };


//   return (
//     <div className='container d-flex flex-column justify-content-center align-items-center min-h-screen p-4'>
      
//       {/* Custom Message Box for info/alerts */}
//       {infoMessage && (
//         <div className="alert alert-info fixed top-4 right-4 z-50 shadow-lg" role="alert">
//             {infoMessage}
//         </div>
//       )}

//       {/* Card */}
//       <div className='card shadow p-4 rounded' style={{ width: '350px' }}>
//         <h4 className='login-text text-center mb-4'>Login</h4>
//         <form onSubmit={handleSubmit}>
          
//           {/* Username Input */}
//           <div className='mb-3'>
//             <label className='form-label'>Username</label>
//             <input
//               type='text'
//               className='form-control'
//               placeholder='Enter your username'
//               value={username}
//               onChange={e => setUsername(e.target.value)}
//             />
//             {/* Display general error message once */}
//             {(errors && username) && <small className='text-danger'>{errors}</small>}
//           </div>

//           {/* Password Input */}
//           <div className='mb-3 position-relative'>
//             <label className='form-label'>Password</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               className='form-control'
//               placeholder='Enter your password'
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               style={{
//                 position: 'absolute',
//                 right: '10px',
//                 top: '38px',
//                 cursor: 'pointer'
//               }}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//             {/* Display general error message once */}
//             {(errors && password) && <small className='text-danger'>{errors}</small>}
//           </div>

//           {/* Login Status Feedback */}
//           {errors && !username && !password && <div className="text-danger mb-3 text-center">{errors}</div>}
//           {success && <div className="text-success mb-3 text-center">{success}</div>}


//           {/* Buttons */}
//           <div className='d-grid mt-4'>
//             <button type='submit' className='btn btn-primary mb-2'>
//               Login
//             </button>

//             <button
//               type='button'
//               className='btn btn-link mb-2'
//               style={{ textDecoration: 'none' }}
//               onClick={handleForgotPassword} // Using custom handler instead of alert()
//             >
//               Forgot Password?
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png' 

// ✅ FIX: 'axiosInstance' याच नावाने इम्पोर्ट करा
import axiosInstance from './axiosconfig' 


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null); 
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    setInfoMessage("Redirect to Forgot Password Page functionality is active.");
    setTimeout(() => setInfoMessage(null), 3000); 
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors("");
    setSuccess("");
    setInfoMessage(null); 

    // 💡 डायग्नोस्टिक चेक: Console मध्ये Base URL प्रिंट करून पहा
    console.log("VITE_API_BASE_URL is:", import.meta.env.VITE_API_BASE_URL); 

    try {
      // 'axiosInstance' चा वापर करून API कॉल
      const response = await axiosInstance.post("/login", { username, password });
      

      // Get and store token
      const token = response.data.token;
      localStorage.setItem("token", token);

      setSuccess("Login successful!");
      navigate("/home");
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data.message);
      } else {
        setErrors("An unexpected error occurred. Please try again later.");
      }
    }
  };


  return (
    <div className='container d-flex flex-column justify-content-center align-items-center min-h-screen p-4'>
      
      {/* Custom Message Box for info/alerts */}
      {infoMessage && (
        <div className="alert alert-info fixed top-4 right-4 z-50 shadow-lg" role="alert">
            {infoMessage}
        </div>
      )}

      {/* Card */}
      <div className='card shadow p-4 rounded' style={{ width: '350px' }}>
        <h4 className='login-text text-center mb-4'>Login</h4>
        <form onSubmit={handleSubmit}>
          
          {/* Username Input */}
          <div className='mb-3'>
            <label className='form-label'>Username</label>
            <input
              type='text'
              className='form-control'
              placeholder='Enter your username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            {/* Display general error message once */}
            {(errors && username) && <small className='text-danger'>{errors}</small>}
          </div>

          {/* Password Input */}
          <div className='mb-3 position-relative'>
            <label className='form-label'>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control'
              placeholder='Enter your password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {/* Display general error message once */}
            {(errors && password) && <small className='text-danger'>{errors}</small>}
          </div>

          {/* Login Status Feedback */}
          {errors && !username && !password && <div className="text-danger mb-3 text-center">{errors}</div>}
          {success && <div className="text-success mb-3 text-center">{success}</div>}


          {/* Buttons */}
          <div className='d-grid mt-4'>
            <button type='submit' className='btn btn-primary mb-2'>
              Login
            </button>

            <button
              type='button'
              className='btn btn-link mb-2'
              style={{ textDecoration: 'none' }}
              onClick={handleForgotPassword} 
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}