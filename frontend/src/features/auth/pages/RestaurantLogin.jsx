import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, Loader2, AlertCircle } from "lucide-react";

import { AuthContext } from "../context/AuthContext.jsx";
import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";

export default function RestaurantLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await http.get("/sanctum/csrf-cookie");

      // 1. Send login request to the restaurant owner endpoint
      const response = await http.post("/api/v1/auth/restaurant/login", {
        email: form.email.trim(),
        password: form.password,
      });

      // 2. Extract the account object from the backend response
      const accountData = response.data?.account || response.data?.data;

      if (accountData) {
        login(accountData); // Set user state in AuthContext directly
      } else {
        login({ email: form.email, role: "RESTAURANT_OWNER" });
      }

      // 3. Navigate straight to the restaurant dashboard
      navigate("/dashboard/restaurant", { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FCFB] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
            <Store size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900">
            Partner Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your restaurant and orders.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-800">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="owner@restaurant.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.email || !form.password}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f45d52] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have a partner account?{" "}
          <Link
            to="/restaurant/register"
            className="font-bold text-[#f45d52] hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
