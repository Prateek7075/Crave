import {
  BarChart3,
  ClipboardList,
  Grid2X2,
  LayoutDashboard,
  Settings,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard/restaurant",
    end: true,
  },
  {
    title: "Restaurant",
    icon: Store,
    to: "/dashboard/restaurant/profile",
  },
  {
    title: "Categories",
    icon: Grid2X2,
    to: "/dashboard/restaurant/categories",
  },
  {
    title: "Menu",
    icon: UtensilsCrossed,
    to: "/dashboard/restaurant/menu",
  },
  {
    title: "Orders",
    icon: ClipboardList,
    to: "/dashboard/restaurant/orders",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    to: "/dashboard/restaurant/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/dashboard/restaurant/settings",
  },
];

export default function RestaurantSidebar({
  restaurant,
  mobileOpen = false,
  onClose,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close restaurant navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-gray-100 bg-white
          shadow-sm transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <div>
            <div className="text-2xl font-black tracking-tight text-[#f45d52]">
              CRAVE
            </div>

            <p className="text-xs font-semibold text-gray-400">
              Restaurant Partner
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-gray-100 px-5 py-5">
          <div className="rounded-2xl bg-[#fff5f3] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#f45d52]">
              Your Restaurant
            </p>

            <p className="mt-2 truncate font-black text-gray-900">
              {restaurant?.name || "Restaurant"}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-gray-500">
                Restaurant account
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.title}
                to={menu.to}
                end={menu.end}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3",
                    "text-sm font-bold transition-colors",
                    isActive
                      ? "bg-[#fff0ed] text-[#f45d52]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  ].join(" ")
                }
              >
                <Icon size={19} strokeWidth={2.2} />

                <span>{menu.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs font-bold text-gray-400">CRAVE RESTAURANT</p>

            <p className="mt-1 text-xs text-gray-500">
              Manage your restaurant from one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
