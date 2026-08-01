import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Cart() {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    // 1. Make sure they are logged in
    if (!user) {
      alert("Please login to place your order!");
      navigate('/login');
      return;
    }
    
    try {
      // 1. Package the cart data
      const orderData = {
        customerId: user._id, 
        items: cartItems.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal + 40 
      };

      // 2. Grab the VIP pass (Token) from local storage!
      const token = localStorage.getItem('crave_token');

      // 3. Send it to MongoDB WITH the token attached!
      const response = await axios.post(
        'http://localhost:5000/api/orders', 
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` } // <-- This is the magic key!
        }
      );
      
      console.log("Order saved:", response.data);
      alert(`Order placed successfully! Your Order ID is: ${response.data._id}`);
      clearCart();
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9FCFB] py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 mt-10">
        Your <span className="text-[#fd5e53]">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-3xl shadow-md border border-gray-100 mt-10">
          <i className="fa-solid fa-basket-shopping text-6xl text-gray-300 mb-6"></i>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty!</h2>
          <p className="text-gray-500 text-lg mb-8">Looks like you haven't added any delicious food yet.</p>
          <Link to="/menu">
            <button className="bg-[#fd5e53] text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-black transition-colors shadow-lg">
              Browse Menu
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.image.startsWith('http') ? item.image : `/images/${item.image}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'; }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">{item.category}</p>
                  <p className="text-[#fd5e53] font-black mt-2">₹{item.price} x {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900 mb-2">₹{item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1 justify-end"
                  >
                    <i className="fa-solid fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 h-fit sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-lg font-medium text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
            </div>
            
            <div className="flex justify-between text-2xl font-black text-gray-900 border-t pt-6 mb-8">
              <span>Total</span>
              <span className="text-[#fd5e53]">₹{cartTotal + 40}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-[#fd5e53] transition-colors shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}