import { useState } from "react";
import { Outlet } from "react-router-dom";

import RestaurantSidebar from "../components/RestaurantSidebar.jsx";
import RestaurantTopbar from "../components/RestaurantTopbar.jsx";
import useRestaurant from "../hooks/useRestaurant.js";

export default function RestaurantDashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Added 'reload' extraction from the useRestaurant hook
  const { restaurant, loading, error, reload } = useRestaurant();

  return (
    <div className="flex min-h-screen bg-[#f7faf9]">
      <RestaurantSidebar
        restaurant={restaurant}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <RestaurantTopbar
          restaurant={restaurant}
          loading={loading}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
              <p className="text-sm font-bold text-red-700">
                Unable to load restaurant information.
              </p>

              <p className="mt-1 text-sm text-red-600">{error.message}</p>
            </div>
          )}

          <Outlet
            context={{
              restaurant,
              restaurantLoading: loading,
              restaurantError: error,
              reload, // Passed reload function to all child pages
            }}
          />
        </main>
      </div>
    </div>
  );
}
