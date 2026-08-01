import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Menu from './pages/Menu';
import About from './pages/About'; 
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AddMenuItem from './pages/AddMenuItem';
import Cart from './pages/Cart';

function App() {
  return (
    <>
      <Navbar />
      
      {/* The Router implementing your Navbar links! */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} /> {/* <-- Connect it here */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
        <Route path="/dashboard/restaurant/add" element={<AddMenuItem />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;