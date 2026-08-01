import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the real orders from MongoDB!
  useEffect(() => {
    const fetchMyOrders = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/customer/${user._id}`);
          setOrders(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      }
    };

    fetchMyOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F9FCFB] py-12 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-12 gap-6 mt-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Welcome Back, <span className="text-[#fd5e53]">{user?.username || 'User'}!</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">Here is your order summary.</p>
        </div>
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white">
          <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=fd5e53&color=fff&size=128`} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 2. Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-center justify-center hover:-translate-y-1 transition-transform">
          <img src="/images/ordertrack.jpg" alt="Tracking" className="max-h-40 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center hover:-translate-y-1 transition-transform">
          <p className="text-xl text-gray-600 font-bold">Total Orders</p>
          <h2 className="text-6xl md:text-7xl font-black text-[#fd5e53] my-4">{orders.length}</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-[#fd5e53] transition-colors">History</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center hover:-translate-y-1 transition-transform flex flex-col justify-center">
          <p className="text-xl text-gray-600 font-bold">Saved Addresses</p>
          <h2 className="text-6xl md:text-7xl font-black text-[#fd5e53] my-4">1</h2>
          <p className="text-lg font-semibold text-gray-700">Home</p>
        </div>
      </div>

      {/* 3. Recent Orders Table (DYNAMIC!) */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-bold text-xl">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold text-xl">You haven't placed any orders yet!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Total Amount</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-gray-500">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {order.items.map(item => (
                        <div key={item._id} className="text-sm">{item.quantity}x {item.name}</div>
                      ))}
                    </td>
                    <td className="p-4 font-bold">₹ {order.totalAmount || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'On the way' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}