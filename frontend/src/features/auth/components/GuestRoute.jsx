import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

export default function GuestRoute({ children }) {
  const { isLoading, isAuthenticated } = useContext(AuthContext);

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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
