import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '', mobnumber: '', email: '', password: '', role: 'customer'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Clear old errors
    
    try {
      // Sending data to your existing backend! Adjust the URL if your route is named differently.
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      console.log("Success:", response.data);
      alert("Account created successfully! Please login.");
      navigate('/login'); // Send them to the login page
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fd5e53] opacity-[0.03] font-black text-[120px] md:text-[250px] pointer-events-none select-none z-0">
        CRAVE
      </div>

      <div className="bg-white shadow-2xl rounded-2xl w-[90%] max-w-4xl z-10 p-10 md:p-14 text-center border border-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Sign Up</h1>
        
        <p className="text-gray-600 mb-8 font-semibold">Enter Your Details</p>

        {/* Display Error if backend rejects it */}
        {error && <p className="text-red-500 font-bold mb-4">{error}</p>}
        
        <form onSubmit={handleSignup} className="max-w-2xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-1 items-center border-b-2 border-[#fd5e53] py-2">
              <i className="fa-solid fa-circle-user text-[#fd5e53] mr-4 text-xl"></i>
              <input type="text" name="username" placeholder="Full Name" required className="w-full outline-none text-lg bg-transparent" onChange={handleChange} />
            </div>
            <div className="flex flex-1 items-center border-b-2 border-[#fd5e53] py-2">
              <i className="fa-solid fa-phone text-[#fd5e53] mr-4 text-xl"></i>
              <input type="tel" name="mobnumber" placeholder="Mobile Number" required className="w-full outline-none text-lg bg-transparent" onChange={handleChange} />
            </div>
          </div>

          <div className="flex items-center border-b-2 border-[#fd5e53] py-2">
            <i className="fa-solid fa-envelope text-[#fd5e53] mr-4 text-xl"></i>
            <input type="email" name="email" placeholder="Email ID" required className="w-full outline-none text-lg bg-transparent" onChange={handleChange} />
          </div>
          
          <div className="flex items-center border-b-2 border-[#fd5e53] py-2">
            <i className="fa-solid fa-lock text-[#fd5e53] mr-4 text-xl"></i>
            <input type="password" name="password" placeholder="Password" required className="w-full outline-none text-lg bg-transparent" onChange={handleChange} />
          </div>

          <div className="flex items-center border-b-2 border-[#fd5e53] py-2 bg-gray-50 px-2 rounded-t">
            <i className="fa-solid fa-user-tag text-[#fd5e53] mr-4 text-xl"></i>
            <select name="role" onChange={handleChange} className="w-full outline-none text-lg bg-transparent text-gray-700 font-semibold cursor-pointer">
                <option value="customer">Register as Customer</option>
                <option value="restaurant_admin">Register as Restaurant Partner</option>
                <option value="delivery_partner">Register as Delivery Rider</option>
            </select>
          </div>
          
          <button type="submit" className="w-48 mx-auto block bg-[#fd5e53] text-white font-bold py-3 text-lg rounded border-2 border-[#fd5e53] hover:bg-black hover:border-black transition-colors shadow-lg">
            Sign Up
          </button>
        </form>
        
        <p className="mt-8 text-lg font-bold text-gray-800">
          Already have an Account? <Link to="/login" className="text-[#fd5e53] underline hover:text-black transition-colors">Login here.</Link>
        </p>
      </div>
    </div>
  );
}