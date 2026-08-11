import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, Loader2, AlertCircle } from "lucide-react";

import { AuthContext } from "../context/AuthContext.jsx";
import { getCurrentCustomer as getCurrentUser } from "../api/customerAuth.js";
import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";

export default function RestaurantRegister() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    full_name: "", // For the owner's user profile
    name: "",      // For the restaurant profile
    email: "",
    mobile: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await http.get("/sanctum/csrf-cookie");

      // 1. Register the restaurant owner
      const response = await http.post("/api/v1/auth/restaurant/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      // 2. Extract the account data directly from the response object
      // (Based on your network response, it returns { message, account })
      const accountData = response.data?.account || response.data?.data;

      if (accountData) {
        login(accountData);
      } else {
        // Fallback if structure varies
        login({ email: form.email, role: "RESTAURANT_OWNER" });
      }

      // 3. Redirect to the restaurant dashboard
      navigate("/dashboard/restaurant", { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to register account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FCFB] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
            <Store size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900">
            Become a Partner
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your owner account to start selling on Crave.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-800">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Owner Full Name</label>
              <input
                name="full_name"
                type="text"
                required
                value={form.full_name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Restaurant Name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                placeholder="e.g. Crave Burger"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
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
              <label className="mb-2 block text-sm font-bold text-gray-700">Mobile Number</label>
              <input
                name="mobile"
                type="tel"
                required
                value={form.mobile}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Confirm Password</label>
              <input
                name="password_confirmation"
                type="password"
                required
                minLength={8}
                value={form.password_confirmation}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.full_name || !form.name || !form.email || !form.password}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f45d52] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have a partner account?{" "}
          <Link
            to="/restaurant/login"
            className="font-bold text-[#f45d52] hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}