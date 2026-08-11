import { useState, useEffect, useCallback } from "react";
import http from "../../../lib/http.js";

/**
 * Custom hook to fetch, state-manage, and reload the authenticated owner's restaurant profile.
 */
export default function useRestaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get("/api/v1/restaurants/me");
      setRestaurant(response.data?.data || response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const updateRestaurantProfile = async (payload) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await http.put("/api/v1/restaurants/me", payload);
      const updated = response.data?.data || response.data;
      setRestaurant(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return {
    restaurant,
    loading,
    error,
    reload: fetchRestaurant,
    updateRestaurant: updateRestaurantProfile,
  };
}

/**
 * Standalone helper function for non-hook contexts.
 */
export async function getRestaurant() {
  const response = await http.get("/api/v1/restaurants/me");
  return response.data?.data || response.data;
}

export async function updateRestaurant(payload) {
  const response = await http.put("/api/v1/restaurants/me", payload);
  return response.data?.data || response.data;
}
