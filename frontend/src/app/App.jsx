import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ScrollToTop from "../components/layout/ScrollToTop.jsx";

import GuestRoute from "../features/auth/components/GuestRoute.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));

const Menu = lazy(() => import("../pages/Menu.jsx"));

const About = lazy(() => import("../pages/About.jsx"));

const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const Login = lazy(() => import("../features/auth/pages/Login.jsx"));

const Cart = lazy(() => import("../features/cart/pages/Cart.jsx"));

const CustomerDashboard = lazy(() => import("../features/customer/dashboard/pages/CustomerDashboard.jsx"),);

const SavedAddresses = lazy(() => import("../features/customer/addresses/pages/SavedAddresses.jsx"),);

const AddAddress = lazy(() => import("../features/customer/addresses/pages/AddAddress.jsx"),);

const EditAddress = lazy(() => import("../features/customer/addresses/pages/EditAddress.jsx"),);

function PageLoader() {
  return (
    <main className="flex min-h-[520px] items-center justify-center bg-[#f7faf9] px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0ed]">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#f45d52]/20 border-t-[#f45d52]" />
        </div>

        <p className="mt-5 font-black text-gray-800">Loading Crave...</p>

        <p className="mt-1 text-sm text-gray-500">
          Preparing this page for you.
        </p>
      </div>
    </main>
  );
}
function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#f7faf9] text-gray-900">
        <ScrollToTop />
        <Navbar />

        <div className="flex-1">
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/menu" element={<Menu />} />

            <Route path="/about" element={<About />} />

            <Route path="/cart" element={<Cart />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path="/register"
              element={<Navigate to="/login" replace />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/addresses"
              element={
                <ProtectedRoute>
                  <SavedAddresses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/addresses/new"
              element={
                <ProtectedRoute>
                  <AddAddress />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/addresses/:addressId/edit"
              element={
                <ProtectedRoute>
                  <EditAddress />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
