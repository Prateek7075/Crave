import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Store, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";

export default function RestaurantProfile() {
  const { restaurant, restaurantLoading, reload } = useOutletContext();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name || "",
        description: restaurant.description || "",
      });
    }
  }, [restaurant]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await http.put("/api/v1/restaurants/me", {
        name: form.name.trim(),
        description: form.description.trim() || null,
      });

      setSuccessMessage("Restaurant profile updated successfully.");
      if (typeof reload === "function") {
        await reload();
      }
    } catch (err) {
      const parsed = parseApiError(err);
      setErrorMessage(parsed.message || "Failed to update restaurant profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (restaurantLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f45d52]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-bold text-[#f45d52]">Configuration</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Restaurant Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Update your public restaurant identity, name, and description visible
          to customers.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <p className="text-sm font-bold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-800 shadow-sm">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-1 space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
            <Store size={28} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {restaurant?.name || "Restaurant"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Slug: {restaurant?.slug}
            </p>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Verification Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 capitalize">
                {restaurant?.verification_status || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Operating Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 capitalize">
                {restaurant?.operating_status || "Active"}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2 space-y-6"
        >
          <div>
            <label
              htmlFor="restaurant-name"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Restaurant Name
            </label>
            <input
              id="restaurant-name"
              name="name"
              type="text"
              required
              maxLength={120}
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="e.g. Gourmet Kitchen"
            />
          </div>

          <div>
            <label
              htmlFor="restaurant-description"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Description{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="restaurant-description"
              name="description"
              rows={4}
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              disabled={submitting}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="Briefly describe your kitchen, specialties, or vibe..."
            />
            <p className="mt-1 text-xs text-gray-400">
              Maximum 1000 characters.
            </p>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={submitting || !form.name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f45d52] px-6 py-3 font-bold text-white transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
