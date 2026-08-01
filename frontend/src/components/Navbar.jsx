import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); // Tap into the global brain
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md h-20 flex items-center justify-between px-8 z-50">
      <div className="w-[15%]">
        <Link to="/"><img src="/images/CRAVE.png" alt="Crave Logo" className="h-10 object-contain" /></Link>
      </div>
      
      <div className="flex gap-10 items-center text-lg font-semibold">
        <Link to="/" className="hover:text-[#fd5e53] transition-colors">Home</Link>
        <Link to="/menu" className="border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-all">Explore Our Menu</Link>
        <Link to="/about" className="hover:text-[#fd5e53] transition-colors">About Us</Link>
        <a href="#contact" className="hover:text-[#fd5e53] transition-colors">Contact Us</a>
      </div>
      
      <div className="w-[20%] flex justify-end items-center gap-4">

        <Link to="/cart" className="relative text-black hover:text-[#fd5e53] transition-colors cursor-pointer mr-2">
          <i className="fa-solid fa-cart-shopping text-2xl"></i>
          {/* Only show the red bubble if there are items in the cart! */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#fd5e53] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              {cartCount}
            </span>
          )}
        </Link>
        
        {/* MAGIC HAPPENS HERE: If user exists, show Dashboard Link & Logout */}
        {user ? (
          <>
            <Link 
              to={user.role === 'restaurant_admin' ? '/dashboard/restaurant' : '/dashboard'} 
              className="font-bold text-[#fd5e53] hover:text-black transition-colors cursor-pointer text-lg"
            >
              Hi, {user.username}!
            </Link>
            <button onClick={handleLogout} className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-[#fd5e53] transition-colors">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-black text-white px-8 py-2 rounded font-bold hover:bg-[#fd5e53] transition-colors">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}