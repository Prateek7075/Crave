import { useContext } from "react";
import { Menu, Bell, Store } from "lucide-react";
import { AuthContext } from "../../auth/context/AuthContext.jsx";

export default function RestaurantTopbar({ restaurant, loading, onMenuClick }) {
  const { user } = useContext(AuthContext);

  // Fallback to the user's name if the restaurant profile isn't fully loaded
  const displayName = restaurant?.name || user?.username || "Partner";

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-50 rounded-lg"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          {/* Optional: Add a search bar here in the future if needed */}
          <h2 className="text-lg font-black text-gray-900 hidden sm:block">
            {loading ? "Loading..." : displayName}
          </h2>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications Button */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* Profile Dropdown Trigger (Visual Only for Topbar) */}
          <div className="flex items-center gap-x-4">
            <span className="sr-only">Your profile</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0ed] text-[#f45d52]">
              <Store size={18} />
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span
                className="ml-2 text-sm font-bold leading-6 text-gray-900"
                aria-hidden="true"
              >
                {user?.username || "Owner"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
