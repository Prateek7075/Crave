import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Grid2X2,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard/restaurant",
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

export default function RestaurantSidebar() {
  return (
    <aside className="w-72 bg-white border-r shadow-sm flex flex-col">
      <div className="h-20 flex items-center justify-center border-b">
        <h1 className="text-3xl font-black text-orange-500">CRAVE</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.title}
              to={menu.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                ${
                                  isActive
                                    ? "bg-orange-500 text-white"
                                    : "hover:bg-orange-100 text-gray-700"
                                }`
              }
            >
              <Icon size={20} />

              <span>{menu.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
