import { useOutletContext } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Activity,
} from "lucide-react";

function MetricCard({ title, value, trend, icon: Icon, trendUp }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45d52]">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={`flex items-center gap-1 font-bold ${
            trendUp ? "text-emerald-600" : "text-red-600"
          }`}
        >
          <TrendingUp size={16} className={trendUp ? "" : "rotate-180"} />
          {trend}
        </span>
        <span className="text-gray-400">vs last week</span>
      </div>
    </div>
  );
}

export default function RestaurantAnalytics() {
  const { restaurant } = useOutletContext();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold text-[#f45d52]">Performance</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Analytics Overview
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Track revenue, order volume, and store performance for{" "}
          {restaurant?.name || "your restaurant"}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Revenue"
          value="$4,289.00"
          trend="+12.5%"
          icon={DollarSign}
          trendUp={true}
        />
        <MetricCard
          title="Total Orders"
          value="156"
          trend="+8.2%"
          icon={Package}
          trendUp={true}
        />
        <MetricCard
          title="Active Menu Items"
          value="42"
          trend="-2.1%"
          icon={Activity}
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-gray-900">Revenue Trend</h2>
            <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-bold text-gray-700 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex h-64 items-center justify-center text-center mt-4">
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                <BarChart3 size={28} />
              </div>
              <p className="text-sm font-bold text-gray-500">
                Chart data will render here once historical data is populated.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4">
            Top Performing Items
          </h2>
          <div className="mt-4 space-y-4">
            {/* Placeholder data for layout purposes */}
            {[
              { name: "Margherita Pizza", sales: 45, revenue: "$540.00" },
              { name: "Spicy Chicken Burger", sales: 38, revenue: "$455.62" },
              { name: "Garlic Bread", sales: 32, revenue: "$160.00" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.sales} orders</p>
                </div>
                <p className="text-sm font-black text-[#f45d52]">
                  {item.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
