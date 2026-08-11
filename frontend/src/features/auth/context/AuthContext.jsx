import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentCustomer as getCurrentUser,
  logoutCustomer as logoutUser,
} from "../api/customerAuth.js";
import http from "../../../lib/http.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function mapUserResponse(responseData) {
  if (
    !responseData ||
    typeof responseData !== "object" ||
    !responseData.account
  ) {
    throw new Error("The server returned invalid user data.");
  }

  const { account, customerProfile, restaurant } = responseData;

  if (typeof account.role !== "string") {
    throw new Error("The server returned incomplete user data.");
  }

  const roleLower = account.role.toLowerCase();

  // 1. Handle Restaurant Owner Mapping (Supports RESTAURANT_OWNER, restaurant, etc.)
  if (roleLower.includes("restaurant") || restaurant) {
    return {
      id: account.id,
      username: restaurant?.name || account.email || "Restaurant Owner",
      role: account.role,
      mobile: account.mobile,
      account,
      restaurant: restaurant || null,
    };
  }

  // 2. Handle Customer Mapping
  if (!customerProfile || typeof customerProfile.fullName !== "string") {
    throw new Error("The server returned incomplete customer data.");
  }

  return {
    id: account.id,
    username: customerProfile.fullName,
    role: account.role,
    mobile: account.mobile,
    account,
    customerProfile,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [initializationError, setInitializationError] = useState(null);

  const login = useCallback((responseData) => {
    const authenticatedUser = mapUserResponse(responseData);
    setUser(authenticatedUser);
    setInitializationError(null);
    setStatus("authenticated");

    return authenticatedUser;
  }, []);

  const clearAuthentication = useCallback(() => {
    setUser(null);
    setInitializationError(null);
    setStatus("guest");
  }, []);

  const refreshAuthentication = useCallback(async () => {
    setStatus("loading");
    setInitializationError(null);

    try {
      const responseData = await getCurrentUser();
      return login(responseData);
    } catch (error) {
      if (error.code === "UNAUTHENTICATED") {
        clearAuthentication();
        return null;
      }

      // If customer check rejects because user is a restaurant owner, fetch restaurant session
      if (error.code === "CUSTOMER_ACCESS_REQUIRED" || error.status === 403) {
        try {
          const restaurantResponse = await http.get("/api/v1/restaurants/me");
          const restaurant =
            restaurantResponse.data?.data || restaurantResponse.data;

          if (restaurant) {
            const ownerAccount = restaurant.ownerAccount ||
              restaurant.owner_account || {
                id: restaurant.owner_account_id,
                role: "RESTAURANT_OWNER",
              };
            return login({
              account: ownerAccount,
              restaurant,
            });
          }
        } catch (restaurantError) {
          clearAuthentication();
          return null;
        }
      }

      setUser(null);
      setInitializationError(error);
      setStatus("error");

      throw error;
    }
  }, [clearAuthentication, login]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      clearAuthentication();
    } catch (error) {
      if (error.code === "UNAUTHENTICATED") {
        clearAuthentication();
        return;
      }
      throw error;
    }
  }, [clearAuthentication]);

  useEffect(() => {
    let isActive = true;

    localStorage.removeItem("crave_token");
    localStorage.removeItem("crave_user");

    async function initializeAuthentication() {
      try {
        const responseData = await getCurrentUser();

        if (!isActive) return;

        login(responseData);
      } catch (error) {
        if (!isActive) return;

        if (error.code === "UNAUTHENTICATED") {
          clearAuthentication();
          return;
        }

        // If customer endpoint rejects because user is a restaurant owner, fetch restaurant session
        if (error.code === "CUSTOMER_ACCESS_REQUIRED" || error.status === 403) {
          try {
            const restaurantResponse = await http.get("/api/v1/restaurants/me");
            const restaurant =
              restaurantResponse.data?.data || restaurantResponse.data;

            if (!isActive) return;

            if (restaurant) {
              const ownerAccount = restaurant.ownerAccount ||
                restaurant.owner_account || {
                  id: restaurant.owner_account_id,
                  role: "RESTAURANT_OWNER",
                };
              login({
                account: ownerAccount,
                restaurant,
              });
              return;
            }
          } catch (restaurantError) {
            if (!isActive) return;
            clearAuthentication();
            return;
          }
        }

        setUser(null);
        setInitializationError(error);
        setStatus("error");
      }
    }

    initializeAuthentication();

    return () => {
      isActive = false;
    };
  }, [clearAuthentication, login]);

  const value = useMemo(
    () => ({
      user,
      status,
      initializationError,

      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      isGuest: status === "guest",

      // Easily distinguishable role booleans supporting both naming conventions
      isRestaurantOwner:
        user?.role === "restaurant" ||
        user?.role === "RESTAURANT_OWNER" ||
        user?.role?.toLowerCase().includes("restaurant"),
      isCustomer:
        user?.role === "customer" ||
        user?.role === "CUSTOMER" ||
        user?.role?.toLowerCase().includes("customer"),

      login,
      logout,
      clearAuthentication,
      refreshAuthentication,
    }),
    [
      user,
      status,
      initializationError,
      login,
      logout,
      clearAuthentication,
      refreshAuthentication,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
