import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { UtensilsCrossed, Plus, Loader2, AlertCircle, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";
import useCategories from "../categories/hooks/useCategories.js";

export default function RestaurantMenu() {
  const { restaurant } = useOutletContext();
  const { categories } = useCategories();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
  });

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await http.get("/api/v1/restaurants/me/menu-items");
      setItems(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Could not load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  function handleOpenCreate() {
    setEditingItem(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category_id: categories[0]?.id ? String(categories[0].id) : "",
      is_available: true,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price ? String(item.price) : "",
      category_id: item.category_id ? String(item.category_id) : "",
      is_available: item.is_available ?? true,
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      category_id: form.category_id ? Number(form.category_id) : null,
      is_available: form.is_available,
    };

    try {
      if (editingItem) {
        await http.put(`/api/v1/restaurants/me/menu-items/${editingItem.id}`, payload);
        setSuccessMessage("Menu item updated successfully.");
      } else {
        await http.post("/api/v1/restaurants/me/menu-items", payload);
        setSuccessMessage("Menu item created successfully.");
      }

      setModalOpen(false);
      await fetchMenuItems();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to save menu item.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    setError("");
    setSuccessMessage("");
    try {
      await http.delete(`/api/v1/restaurants/me/menu-items/${item.id}`);
      setSuccessMessage("Menu item deleted successfully.");
      await fetchMenuItems();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to delete menu item.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#f45d52]">Catalogue Management</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Restaurant Menu
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Create and manage dishes, pricing, and availability for {restaurant?.name || "your restaurant"}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f45d52] px-5 py-3 font-bold text-white transition hover:bg-[#e94d43]"
        >
          <Plus size={18} />
          Add Menu Item
        </button>
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
        ) : items.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
              <UtensilsCrossed size={28} />
            </div>
            <h3 className="mt-4 text-lg font-black text-gray-900">No menu items found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Get started by adding your first dish or beverage to your restaurant menu catalogue.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${item.is_available ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  {item.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{item.description}</p>}
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-gray-950">${Number(item.price).toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-black text-gray-900">
                {editingItem ? "Edit Menu Item" : "Create Menu Item"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">Configure item details, price, and availability.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Item Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  maxLength={255}
                  value={form.name}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                  placeholder="e.g. Margherita Pizza"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Category <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Price ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                  placeholder="9.99"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Description <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  maxLength={2000}
                  value={form.description}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
                  placeholder="Ingredients, preparation, or flavor profile..."
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-gray-300 accent-[#f45d52]"
                />
                <div>
                  <p className="text-sm font-bold text-gray-700">Available for ordering</p>
                  <p className="text-xs text-gray-400">Customers can add this item to their cart.</p>
                </div>
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim() || !form.price}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f45d52] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}