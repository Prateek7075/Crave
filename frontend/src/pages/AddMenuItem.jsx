import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AddMenuItem() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pizza',
    image: ''
  });

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // We will need to grab the token to prove to the backend that an Admin is doing this
      const token = localStorage.getItem('crave_token');
      
      // Send the food item to the backend! (We will verify this backend route next)
      const response = await axios.post(
        'http://localhost:5000/api/menu', 
        { ...itemData, restaurantId: user._id },
        { headers: { Authorization: `Bearer ${token}` } } // Security check!
      );

      alert(`${itemData.name} added to your menu successfully!`);
      navigate('/dashboard/restaurant'); // Send them back to the dashboard
      
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add menu item. Check the console.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9FCFB] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-black text-gray-900">Add New Menu Item</h1>
          <Link to="/dashboard/restaurant" className="text-gray-500 hover:text-[#fd5e53] font-bold">
            &larr; Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">Item Name</label>
            <input type="text" name="name" required placeholder="e.g., Margherita Pizza" 
                   className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-[#fd5e53] transition-colors"
                   onChange={handleChange} />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea name="description" rows="3" required placeholder="Brief description of the dish..." 
                      className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-[#fd5e53] transition-colors"
                      onChange={handleChange}></textarea>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-2">Price (₹)</label>
              <input type="number" name="price" required placeholder="299" min="0"
                     className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-[#fd5e53] transition-colors"
                     onChange={handleChange} />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-2">Category</label>
              <select name="category" className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-[#fd5e53] transition-colors bg-white cursor-pointer" onChange={handleChange}>
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="noodles">Noodles</option>
                <option value="dessert">Dessert</option>
                <option value="healthy">Healthy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Image Name (from public/images)</label>
            <input type="text" name="image" required placeholder="e.g., pizza.jpg" 
                   className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-[#fd5e53] transition-colors"
                   onChange={handleChange} />
            <p className="text-sm text-gray-500 mt-1">For now, just type the filename of an image you have in your public/images folder.</p>
          </div>

          <button type="submit" className="w-full bg-[#fd5e53] text-white font-bold py-4 rounded text-lg hover:bg-black transition-colors mt-8 shadow-lg">
            Save Item to Menu
          </button>
          
        </form>
      </div>
    </div>
  );
}