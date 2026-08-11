import {
  ArrowRight,
  FolderTree,
  Store,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import http from "../../../lib/http.js";

import useCategories from "../categories/hooks/useCategories.js";

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-black text-gray-900">{value}</p>
          <p className="mt-2 text-xs font-medium text-gray-400">
            {description}
          </p>
        </div>

        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45d52]">
            <Icon size={23} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantDashboard() {
  const { restaurant, restaurantLoading } = useOutletContext();
  const { categories, loading: categoriesLoading } = useCategories();

  const [menuCount, setMenuCount] = useState("...");

  useEffect(() => {
    async function fetchMenuCount() {
      try {
        const response = await http.get("/api/v1/restaurants/me/menu-items");
        const items = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setMenuCount(items.length);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setMenuCount("0");
      }
    }

    fetchMenuCount();
  }, []);

  const restaurantName = restaurant?.name || "Your Restaurant";
  const categoryCount = categoriesLoading ? "..." : categories.length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-bold text-[#f45d52]">Restaurant Dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Welcome back 👋
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Manage {restaurantName}, your menu, categories, and restaurant
          operations from one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Restaurant"
          value={restaurantLoading ? "..." : "1"}
          description="Your active restaurant account"
          icon={Store}
        />

        <StatCard
          title="Categories"
          value={categoryCount}
          description="Menu categories configured"
          icon={FolderTree}
        />

        <StatCard
          title="Menu Items"
          value={menuCount}
          description="Active dishes in your catalogue"
          icon={UtensilsCrossed}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-bold text-gray-500">Restaurant status</p>
            <h2 className="mt-2 text-xl font-black text-gray-900">
              {restaurant?.name || "Restaurant"}
            </h2>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-4">
            <span
              className={`h-3 w-3 rounded-full ${restaurant?.operating_status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            <div>
              <p className="text-sm font-bold text-gray-800">
                {restaurant?.operating_status === "active"
                  ? "Restaurant is live and taking orders"
                  : "Restaurant information is connected"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Status:{" "}
                <span className="capitalize">
                  {restaurant?.verification_status || "Pending"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Quick actions</p>

          <div className="mt-5 space-y-3">
            <Link
              to="/dashboard/restaurant/orders"
              className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-4 transition hover:border-[#f45d52]/20 hover:bg-[#fff8f6]"
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-black text-gray-900">
                    View Orders
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage incoming requests.
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#f45d52]" />
            </Link>

            <Link
              to="/dashboard/restaurant/menu"
              className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-4 transition hover:border-[#f45d52]/20 hover:bg-[#fff8f6]"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-black text-gray-900">
                    Manage Menu
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Add and edit dishes.
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#f45d52]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
