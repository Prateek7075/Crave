import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const {
    isLoading,
    isAuthenticated,
    initializationError,
    refreshAuthentication,
  } = useContext(AuthContext);

  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9FCFB]">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-[#fd5e53] rounded-full animate-spin" />

          <p className="mt-4 font-semibold text-gray-600">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  if (initializationError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9FCFB] px-4">
        <section className="max-w-md w-full bg-white shadow-xl border border-gray-100 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to verify your session
          </h1>

          <p className="mt-3 text-gray-600">{initializationError.message}</p>

          <button
            type="button"
            onClick={() => {
              refreshAuthentication().catch(() => {});
            }}
            className="mt-6 bg-[#fd5e53] text-white font-bold px-6 py-3 rounded-lg hover:bg-black transition-colors"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return children;
}
