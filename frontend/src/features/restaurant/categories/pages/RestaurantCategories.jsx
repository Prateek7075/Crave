import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FolderTree,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import useCategories from "../hooks/useCategories.js";
import CategoryGrid from "../components/CategoryGrid.jsx";
import CategoryFormModal from "../components/CategoryFormModal.jsx";

export default function RestaurantCategories() {
  const { restaurant } = useOutletContext();
  const {
    categories,
    loading,
    error: fetchError,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setActionError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setActionError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setActionError("");
    setSuccessMessage("");

    try {
      if (editingCategory) {
        await editCategory(editingCategory.id, formData);
        setSuccessMessage("Category updated successfully.");
      } else {
        await addCategory(formData);
        setSuccessMessage("Category created successfully.");
      }
      setIsModalOpen(false);
    } catch (err) {
      setActionError(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the "${category.name}" category? This cannot be undone.`,
      )
    ) {
      return;
    }

    setActionError("");
    setSuccessMessage("");

    try {
      await removeCategory(category.id);
      setSuccessMessage("Category deleted successfully.");
    } catch (err) {
      setActionError(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-[#f45d52]">
            <FolderTree size={16} /> Catalogue Organization
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Menu Categories
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Create and organize sections for your menu at{" "}
            {restaurant?.name || "your restaurant"}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f45d52] px-5 py-3 font-bold text-white transition hover:bg-[#e94d43]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <p className="text-sm font-bold">{successMessage}</p>
        </div>
      )}

      {(actionError || fetchError) && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-red-800 shadow-sm">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <p className="text-sm font-bold">{actionError || fetchError}</p>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#f45d52]" />
        </div>
      ) : (
        <CategoryGrid
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Floating Create/Edit Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingCategory}
        isSaving={isSaving}
      />
    </div>
  );
}
