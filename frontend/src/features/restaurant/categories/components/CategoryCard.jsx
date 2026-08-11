import { Pencil, Trash2, GripVertical } from "lucide-react";

export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <GripVertical size={16} className="text-gray-300" />
            <h3 className="text-lg font-black text-gray-900">
              {category.name}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${category.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
          >
            {category.is_active ? "Active" : "Hidden"}
          </span>
        </div>
        {category.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 ml-6">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between ml-6">
        <span className="text-xs font-bold text-gray-400">
          Order: {category.display_order}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
