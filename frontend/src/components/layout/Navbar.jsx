import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../features/auth/context/AuthContext.jsx";
import { CartContext } from "../../features/cart/context/CartContext.jsx";

function navigationClass({ isActive }) {
  return [
    "rounded-lg px-4 py-2 text-sm font-bold",
    "transition-colors duration-200",
    isActive
      ? "bg-[#fff1ef] text-[#f45d52]"
      : "text-gray-700 hover:bg-gray-100 hover:text-black",
  ].join(" ");
}

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    isCustomer,
    isRestaurantOwner,
  } = useContext(AuthContext);

  const { cartCount = 0 } = useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    setIsMenuOpen(false);
    setLogoutError("");
  }, [location.pathname]);

  const accountName =
    user?.customerProfile?.fullName ||
    user?.restaurant?.name ||
    user?.username ||
    "My Account";

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(error?.message || "Logout could not be completed.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Crave home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f45d52] text-white shadow-sm transition-transform group-hover:-rotate-6">
            <i className="fa-solid fa-utensils text-lg" />
          </span>
          <span className="text-3xl font-black tracking-tight text-[#f45d52]">
            Crave
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" end className={navigationClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navigationClass}>
            Explore Menu
          </NavLink>
          <NavLink to="/about" className={navigationClass}>
            About Us
          </NavLink>

          {isAuthenticated && isCustomer && (
            <>
              <NavLink to="/dashboard" end className={navigationClass}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/addresses" className={navigationClass}>
                Addresses
              </NavLink>
            </>
          )}

          {isAuthenticated && isRestaurantOwner && (
            <NavLink to="/dashboard/restaurant" className={navigationClass}>
              Partner Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Hide Cart for Restaurant Owners */}
          {!isRestaurantOwner && (
            <Link
              to="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-800 transition-colors hover:bg-gray-100 hover:text-[#f45d52]"
              aria-label={`Cart with ${cartCount} items`}
            >
              <i className="fa-solid fa-cart-shopping text-xl" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f45d52] px-1 text-[11px] font-black text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {isLoading && (
            <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-200" />
          )}

          {!isLoading && !isAuthenticated && (
            <Link
              to="/login"
              className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#f45d52]"
            >
              Login
            </Link>
          )}

          {!isLoading && isAuthenticated && (
            <>
              <Link
                to={isRestaurantOwner ? "/dashboard/restaurant" : "/dashboard"}
                className="max-w-44 truncate rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-[#f45d52] hover:text-[#f45d52]"
                title={accountName}
              >
                {accountName}
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#f45d52] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {!isRestaurantOwner && (
            <Link
              to="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-800"
              aria-label={`Cart with ${cartCount} items`}
            >
              <i className="fa-solid fa-cart-shopping text-xl" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f45d52] px-1 text-[10px] font-black text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-900"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <i
              className={
                isMenuOpen
                  ? "fa-solid fa-xmark text-xl"
                  : "fa-solid fa-bars text-xl"
              }
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            <NavLink to="/" end className={navigationClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navigationClass}>
              Explore Menu
            </NavLink>
            <NavLink to="/about" className={navigationClass}>
              About Us
            </NavLink>

            {isAuthenticated && isCustomer && (
              <>
                <NavLink to="/dashboard" end className={navigationClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/addresses" className={navigationClass}>
                  Saved Addresses
                </NavLink>
              </>
            )}

            {isAuthenticated && isRestaurantOwner && (
              <NavLink to="/dashboard/restaurant" className={navigationClass}>
                Partner Dashboard
              </NavLink>
            )}

            <div className="mt-3 border-t border-gray-100 pt-4">
              {isLoading && (
                <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
              )}

              {!isLoading && !isAuthenticated && (
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 font-bold text-white"
                >
                  Login
                </Link>
              )}

              {!isLoading && isAuthenticated && (
                <div className="space-y-3">
                  <Link
                    to={
                      isRestaurantOwner ? "/dashboard/restaurant" : "/dashboard"
                    }
                    className="block truncate rounded-xl bg-[#fff1ef] px-4 py-3 font-bold text-[#f45d52]"
                  >
                    {accountName}
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={isLoggingOut}
                    className="w-full rounded-xl bg-black px-5 py-3 font-bold text-white disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}

              {logoutError && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  {logoutError}
                </p>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
