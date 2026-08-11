import { FolderTree } from "lucide-react";
import CategoryCard from "./CategoryCard.jsx";

export default function CategoryGrid({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
          <FolderTree size={28} />
        </div>
        <h3 className="mt-4 text-lg font-black text-gray-900">
          No categories found
        </h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          Create your first menu category (e.g., "Appetizers" or "Main Course")
          to organize your menu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
