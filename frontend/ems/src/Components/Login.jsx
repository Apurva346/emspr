import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosconfig'; 


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

  //handleSubmit for local
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors("");
    setSuccess("");
    setInfoMessage(null); 

    console.log("VITE_API_BASE_URL is:", import.meta.env.VITE_API_BASE_URL); 

    try {
      const response = await axiosInstance.post("/login", { username, password });
      
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
    // 🌟 मूळ ग्रेडियंट बॅकग्राउंड आणि सेंटर ॲलाइनमेंट (Center Alignment)
    <div 
      className='d-flex flex-column justify-content-center align-items-center' 
      style={{ 
        minHeight: '100vh', 
        // 💡 Original Gradient from your App.css body style
        background: 'linear-gradient(180deg, #7f66ab 0%, #563680 35%, #5d88c8 100%)' 
      }}
    >
      
      {/* Custom Message Box for info/alerts */}
      {infoMessage && (
        <div className="alert alert-info fixed top-4 right-4 z-50 shadow-lg" role="alert">
            {infoMessage}
        </div>
      )}

      {/* Card: मूळ स्टाईल, फक्त Center ॲलाइनमेंट आणि थोडी आकर्षक शॅडो (shadow-lg) ठेवली आहे */}
      <div className='card shadow-lg p-4 rounded' style={{ width: '350px' }}>
        <h4 className='login-text text-center mb-4'>Login</h4> {/* मूळ हेडिंग */}
        
        <form onSubmit={handleSubmit}>
          
          {/* Username Input */}
          <div className='mb-3'>
            <label className='form-label'>Username</label>
            <input
              type='text'
              className='form-control' // मूळ form-control
              placeholder='Enter your username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className='mb-3 position-relative'>
            <label className='form-label'>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className='form-control' // मूळ form-control
              placeholder='Enter your password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px', // मूळ ॲलाइनमेंट
                cursor: 'pointer'
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Login Status Feedback */}
          {errors && !username && !password && <div className="text-danger mb-3 text-center">{errors}</div>}
          {success && <div className="text-success mb-3 text-center">{success}</div>}


          {/* Buttons */}
          <div className='d-grid mt-4'>
            <button type='submit' className='btn btn-primary mb-2'>
              Login
            </button>

            {/* <button
              type='button'
              className='btn btn-link mb-2'
              style={{ textDecoration: 'none' }}
              onClick={handleForgotPassword} 
            >
              Forgot Password?
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

