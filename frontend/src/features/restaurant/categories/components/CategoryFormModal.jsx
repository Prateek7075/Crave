import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  // Populate form if editing, reset if creating new
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        display_order: initialData.display_order ?? 0,
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        description: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      display_order: Number(form.display_order), // Ensure it sends as an integer
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {initialData ? "Edit Category" : "Create Category"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Organize how your menu items are grouped.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Category Name
            </label>
            <input
              name="name"
              type="text"
              required
              maxLength={255}
              value={form.name}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="e.g. Popular Items, Mains, Drinks"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Description{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              name="description"
              rows={2}
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
              placeholder="A short description of this category..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Display Order
            </label>
            <input
              name="display_order"
              type="number"
              min="0"
              required
              value={form.display_order}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#f45d52] focus:ring-2 focus:ring-[#f45d52]/10"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first on your menu.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={isSaving}
              className="h-4 w-4 rounded border-gray-300 accent-[#f45d52]"
            />
            <div>
              <p className="text-sm font-bold text-gray-700">
                Category is active
              </p>
              <p className="text-xs text-gray-400">
                If unchecked, this category and its items are hidden from
                customers.
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !form.name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f45d52] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e94d43] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isSaving
                ? "Saving..."
                : initialData
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
