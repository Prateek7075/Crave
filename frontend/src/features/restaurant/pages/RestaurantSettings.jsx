import { useContext, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext.jsx";
import { Shield, Bell, Key, LogOut, AlertOctagon } from "lucide-react";
import http from "../../../lib/http.js";

export default function RestaurantSettings() {
  const { user, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const ownerEmail =
    user?.email || user?.account?.email || "owner@restaurant.com";
  const ownerName =
    user?.customerProfile?.fullName || user?.username || "Restaurant Owner";

  async function handleLogout() {
    if (
      !window.confirm(
        "Are you sure you want to log out of your restaurant dashboard?",
      )
    ) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-bold text-[#f45d52]">
          Account Configuration
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Settings & Security
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Manage your owner account details, security preferences, and active
          sessions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-gray-900">Owner Profile</h2>
          <p className="text-sm text-gray-500">
            Your personal account information.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Full Name
            </label>
            <p className="mt-1 font-bold text-gray-900">{ownerName}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Email Address
            </label>
            <div className="mt-1 flex items-center gap-3">
              <p className="font-bold text-gray-900">{ownerEmail}</p>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Verified
              </span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              className="text-sm font-bold text-[#f45d52] hover:underline"
            >
              Request Email Change
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr] border-t border-gray-100 pt-8">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-gray-900">Security</h2>
          <p className="text-sm text-gray-500">
            Keep your restaurant data safe.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <Key size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Password</p>
                <p className="text-xs text-gray-500">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Enable
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr] border-t border-gray-100 pt-8">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-red-600">Danger Zone</h2>
          <p className="text-sm text-gray-500">Destructive account actions.</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-red-200 pb-4">
            <div>
              <p className="font-bold text-gray-900">Log Out</p>
              <p className="text-xs text-red-700 mt-1">
                Sign out of this browser session.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-gray-900">Deactivate Restaurant</p>
              <p className="text-xs text-red-700 mt-1">
                Temporarily hide your menu from customers.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700"
            >
              <AlertOctagon size={16} />
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
