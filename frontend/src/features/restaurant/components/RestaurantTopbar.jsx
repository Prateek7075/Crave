import { Bell } from "lucide-react";

export default function RestaurantTopbar() {
  return (
    <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Restaurant Dashboard</h2>

        <p className="text-sm text-gray-500">Manage your restaurant easily.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={24} />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            R
          </div>

          <div>
            <p className="font-semibold">Restaurant Owner</p>

            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
