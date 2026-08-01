import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react'; // Add this to your React imports
import { CartContext } from '../context/CartContext'; // Import the context

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  // Fetch the food from MongoDB when the page loads!
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter the items based on the category button clicked
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9FCFB] py-12 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="text-center mt-10 mb-12">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tight">
          Explore Our <span className="text-[#fd5e53]">Menu</span>
        </h1>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Freshly prepared, dynamically loaded directly from your database!
        </p>
      </div>

      {/* 2. Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {['all', 'pizza', 'burger', 'noodles', 'dessert', 'healthy'].map((category) => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-3 rounded-full text-lg font-bold capitalize transition-all duration-300 ${
              activeCategory === category 
                ? 'bg-black text-white shadow-lg scale-105' 
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 3. Loading State */}
      {loading ? (
        <div className="text-center text-2xl font-bold text-gray-500 my-20">
          Loading delicious food... <i className="fa-solid fa-spinner fa-spin text-[#fd5e53]"></i>
        </div>
      ) : (
        
        /* 4. The Dynamic Food Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-xl text-gray-500 font-bold py-10">
              No items found in this category yet!
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                
                {/* Food Image */}
                <div className="h-64 overflow-hidden relative bg-gray-100">
                  {/* We check if the image is a URL or a local file. If local, we look in /images/ */}
                  <img 
                    src={item.image.startsWith('http') ? item.image : `/images/${item.image}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'; }} // Fallback image if yours breaks
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-black text-[#fd5e53] shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-8 flex-1">{item.description}</p>
                  
                  {/* Add to Cart Button */}
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => {
                      addToCart(item);
                      alert(`${item.name} added to your cart!`);
                    }}
                    className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-[#fd5e53] transition-colors shadow-md flex justify-center items-center gap-2"
                  >
                    <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}