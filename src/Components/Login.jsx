import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
// import logo from '../assets/logo.png'
import axios from "axios";


export default function Login () {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async event => {
    event.preventDefault()
    setErrors('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password
      })

      setSuccess(response.data.message)
      console.log('Login successful:', response.data)

      navigate('/home')
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data.message)
      } else {
        setErrors('An unexpected error occurred. Please try again later.')
      }
    }
  }

  return (
    <div className='container d-flex flex-column justify-content-center align-items-center'>
      {/* <h2 className="mb-4 text-primary fw-bold ">Welcome to, S&amp;P Finance</h2> */}

      {/* Card */}
      <div className='card shadow p-4 rounded' style={{ width: '350px' }}>
        {/* <img className='logo-circle' src={logo} alt='Logo' /> */}
        <h4 className='login-text text-center mb-3'>Login</h4>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className='mb-3'>
            <label className='form-label'>Username</label>
            <input
              type='text'
              className='form-control'
              placeholder='Enter your username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            {/* {errors.username && (
              <small className='text-danger'>{errors.username}</small>
            )} */}
            {errors && <small className='text-danger'>{errors}</small>}

          </div>

          {/* Password */}
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
            {/* {errors.password && (
              <small className='text-danger'>{errors.password}</small>
            )} */}
            {errors && <small className='text-danger'>{errors}</small>}

          </div>

          {/* Buttons */}
          <div className='d-grid'>
            <button type='submit' className='btn btn-primary mb-2'>
              Login
            </button>

            <button
              type='button'
              className='btn btn-link mb-2'
              style={{ textDecoration: 'none' }}
              onClick={() => alert('Redirect to Forgot Password Page')}
            >
              Forgot Password?
            </button>

            {/* <button
              type="button"
              className="btn google-btn d-flex align-items-center justify-content-center"
            >
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                alt="Google logo"
                className="google-icon"
              />
              <span className="btn-text">Login with Google</span>
            </button> */}
          </div>
        </form>
      </div>
    </div>
  )
}

