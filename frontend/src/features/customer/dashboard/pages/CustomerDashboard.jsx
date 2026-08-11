import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";

import { AuthContext } from "../../../auth/context/AuthContext.jsx";
import http from "../../../../lib/http.js";
import { parseApiError } from "../../../../lib/apiError.js";

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const response = await http.get("/api/v1/customer/orders");
        // Ensure we extract the array properly from the paginated/resource response
        setOrders(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        const parsed = parseApiError(err);
        setError(parsed.message || "Could not load recent orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecentOrders();
  }, []);

  const fullName =
    user?.customerProfile?.fullName || user?.username || "Customer";
  const mobile = user?.mobile || "No mobile number linked";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <section>
        <p className="text-sm font-bold text-[#f45d52]">Customer Dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Welcome back, {fullName} 👋
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Manage your account details, delivery addresses, and track your recent
          orders.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Column: Profile & Quick Links */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900">
              Account Details
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Name
                </p>
                <p className="mt-1 font-bold text-gray-900">{fullName}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Mobile
                </p>
                <p className="mt-1 font-bold text-gray-900">{mobile}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                to="/dashboard/addresses"
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-4 transition hover:border-[#f45d52]/20 hover:bg-[#fff8f6]"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      Saved Addresses
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Manage delivery locations.
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-[#f45d52]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
            <Link
              to="/menu"
              className="text-sm font-bold text-[#f45d52] hover:underline"
            >
              Start a new order
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#f45d52]" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-800">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <Package size={24} />
                </div>
                <h3 className="mt-4 text-sm font-black text-gray-900">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Looks like you haven't placed any orders.
                </p>
                <Link
                  to="/menu"
                  className="mt-4 rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <UtensilsCrossed size={16} className="text-gray-400" />
                        <span className="font-black text-gray-900">
                          {order.restaurant?.name || "Restaurant"}
                        </span>
                        <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#f45d52]">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-gray-700">
                          ${Number(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm border border-gray-200 transition hover:bg-gray-50"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
