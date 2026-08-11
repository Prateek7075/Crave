import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ClipboardList,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";

export default function RestaurantOrders() {
  const { restaurant } = useOutletContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await http.get("/api/v1/restaurants/me/orders");
      setOrders(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Could not load restaurant orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleUpdateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    setError("");
    setSuccessMessage("");

    try {
      await http.patch(`/api/v1/restaurants/me/orders/${orderId}/status`, {
        status: newStatus,
      });
      setSuccessMessage(`Order #${orderId} status updated to ${newStatus}.`);
      await fetchOrders();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold text-[#f45d52]">Operations</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Customer Orders
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Track incoming live orders and update fulfillment statuses for{" "}
          {restaurant?.name || "your restaurant"}.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <p className="text-sm font-bold">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-800 shadow-sm">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#f45d52]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
              <ClipboardList size={28} />
            </div>
            <h3 className="mt-4 text-lg font-black text-gray-900">
              No orders received yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Incoming customer orders will appear here in real-time as users
              check out from your restaurant menu.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-[#fafafa] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900">
                      Order #{order.id}
                    </span>
                    <span className="rounded-full bg-orange-50 px-3 py-0.5 text-xs font-bold text-[#f45d52] capitalize">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on: {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    Total: ${Number(order.total_amount || 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, "accepted")}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, "preparing")}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    Preparing
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, "ready")}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Ready
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
