import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Tapping into our global "Brain"

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      console.log("Logged in successfully:", response.data);
      
      // We grab your flat data here
      const { token, ...userData } = response.data;
      login(userData, token);

      alert("Welcome back!");
      
      // THE FIX: Check userData.role directly!
      if (userData.role === 'restaurant_admin') {
        navigate('/dashboard/restaurant');
      } else {
        navigate('/'); 
      }
      
    } catch (err) {
      console.error("Login error:", err);
      // Show the error message from the backend, or a default message
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-10 bg-[#F9FCFB]">
      {/* Giant Faint Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fd5e53] opacity-[0.03] font-black text-[120px] md:text-[250px] pointer-events-none select-none z-0">
        CRAVE
      </div>

      {/* Login Card */}
      <div className="bg-white shadow-2xl rounded-2xl w-[90%] max-w-3xl z-10 p-10 md:p-16 text-center border border-gray-100">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Login</h1>
        
        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-6">
          {['google', 'x-twitter', 'facebook', 'linkedin'].map((social) => (
            <a href="#" key={social} className="bg-[#fd5e53] text-white p-2 rounded w-10 h-10 flex items-center justify-center hover:bg-black transition-colors shadow-sm">
              <i className={`fa-brands fa-${social} text-lg`}></i>
            </a>
          ))}
        </div>
        
        <p className="text-gray-600 mb-8 font-semibold">or use Email Address</p>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md mx-auto">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-8">
          <div className="flex items-center border-b-2 border-[#fd5e53] py-2">
            <i className="fa-solid fa-envelope text-[#fd5e53] mr-4 text-xl"></i>
            <input 
              type="email" 
              placeholder="Email ID" 
              required
              className="w-full outline-none text-lg bg-transparent placeholder-gray-500 text-gray-900"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-center border-b-2 border-[#fd5e53] py-2">
            <i className="fa-solid fa-lock text-[#fd5e53] mr-4 text-xl"></i>
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full outline-none text-lg bg-transparent placeholder-gray-500 text-gray-900"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#fd5e53]" /> Remember Me
            </label>
            <a href="#" className="hover:text-[#fd5e53] transition-colors">Forget Your Password?</a>
          </div>
          
          <button 
            type="submit" 
            className="w-48 mx-auto block bg-[#fd5e53] text-white font-bold py-3 text-lg rounded border-2 border-[#fd5e53] hover:bg-black hover:border-black transition-colors shadow-lg"
          >
            Login
          </button>
        </form>
        
        <p className="mt-10 text-lg font-bold text-gray-800">
          If you don't have an account, <Link to="/register" className="text-[#fd5e53] underline hover:text-black transition-colors">register here</Link>
        </p>
      </div>
    </div>
  );
}