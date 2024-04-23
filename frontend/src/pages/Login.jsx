import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
const navigate = useNavigate();
const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/employee/login', {
        email,
        password
      });
      console.log('Logged in successfully:', response.data._id);
      // Redirect to dashboard after successful login
      const {_id}=response.data;
      navigate(`/Dash/${_id}`); // Change to '/Dashboard'
    } catch (error) {
      console.error('Login error:', error.response.data.message);
      setError(error.response.data.message);
    }
  };
  

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password
      });
      console.log('Signup successful:', response.data);
      // Handle successful signup (e.g., redirect to login)
    } catch (error) {
      console.error('Signup error:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        {showLogin ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email:</label>
                <input type="email" value={email} onChange={handleEmailChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <button type="button" onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Login</button>
            </form>
            <p className="mt-4 text-gray-700">Don't have an account? <button className="text-blue-500 underline" onClick={() => setShowLogin(false)}>Signup</button></p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name:</label>
                <input type="text" value={name} onChange={handleNameChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email:</label>
                <input type="email" value={email} onChange={handleEmailChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} className="border border-gray-300 px-3 py-2 w-full rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <button type="button" onClick={handleSignup} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Signup</button>
            </form>
            <p className="mt-4 text-gray-700">Already have an account? <button className="text-blue-500 underline" onClick={() => setShowLogin(true)}>Login</button></p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
