import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantDashboard() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all orders when the dashboard loads
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 2. Function to update an order's status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      // Refresh the orders list to show the new status
      fetchAllOrders();
      alert(`Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Calculate some quick stats
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9FCFB] py-12 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-12 gap-6 mt-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Restaurant Admin: <span className="text-[#fd5e53]">{user?.username || 'Partner'}</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">Manage your menu and track incoming orders.</p>
        </div>
      </div>

      {/* 2. Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-md border-l-8 border-black">
          <p className="text-xl text-gray-600 font-bold">Active Orders</p>
          <h2 className="text-5xl font-black text-gray-900 my-4">{activeOrdersCount}</h2>
          <p className="text-green-600 font-bold">Requires attention</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-md border-l-8 border-[#fd5e53]">
          <p className="text-xl text-gray-600 font-bold">Total Revenue</p>
          <h2 className="text-5xl font-black text-[#fd5e53] my-4">₹ {totalRevenue}</h2>
          <p className="text-gray-500 font-bold">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex items-center justify-center">
          <Link to="/dashboard/restaurant/add" className="w-full">
            <button className="w-full bg-[#fd5e53] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-black transition-colors shadow-lg">
              + Add New Menu Item
            </button>
          </Link>
        </div>
      </div>

      {/* 3. Live Order Queue */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Live Order Queue</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold">No orders yet!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Update Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-xs font-mono text-gray-500">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4">
                      {order.items.map(item => (
                        <div key={item._id} className="text-sm">{item.quantity}x {item.name}</div>
                      ))}
                    </td>
                    <td className="p-4 font-bold text-[#fd5e53]">₹ {order.totalAmount || 'N/A'}</td>
                    <td className="p-4">
                      {/* THE MAGIC STATUS DROPDOWN */}
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`p-2 rounded font-bold cursor-pointer outline-none ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'On the way' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        }`}
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="On the way">On the way</option>
                        <option value="Delivered">Delivered</option>
                      </select>
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