import RestaurantSidebar from "../components/RestaurantSidebar";
import RestaurantTopbar from "../components/RestaurantTopbar";

export default function RestaurantDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <RestaurantSidebar />

      <div className="flex-1 flex flex-col">
        <RestaurantTopbar />

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
