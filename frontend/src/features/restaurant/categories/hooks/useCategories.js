import { useState, useEffect, useCallback } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi.js";
import { parseApiError } from "../../../../lib/apiError.js";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCategories();
      // Ensure we always have an array, even if the backend returns empty
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || "Failed to load menu categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (payload) => {
    try {
      const result = await createCategory(payload);
      await loadCategories(); // Refresh the list after adding
      return result;
    } catch (err) {
      throw parseApiError(err);
    }
  };

  const editCategory = async (categoryId, payload) => {
    try {
      const result = await updateCategory(categoryId, payload);
      await loadCategories(); // Refresh the list after editing
      return result;
    } catch (err) {
      throw parseApiError(err);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      await loadCategories(); // Refresh the list after deletion
    } catch (err) {
      throw parseApiError(err);
    }
  };

  return {
    categories,
    loading,
    error,
    reload: loadCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
}
