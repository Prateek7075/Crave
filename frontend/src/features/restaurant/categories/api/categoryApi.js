import http from "../../../../lib/http.js";

export async function fetchCategories() {
  const response = await http.get("/api/v1/restaurants/me/menu-categories");
  return response.data;
}

export async function createCategory(payload) {
  const response = await http.post(
    "/api/v1/restaurants/me/menu-categories",
    payload,
  );
  return response.data;
}

export async function updateCategory(categoryId, payload) {
  const response = await http.put(
    `/api/v1/restaurants/me/menu-categories/${categoryId}`,
    payload,
  );
  return response.data;
}

export async function deleteCategory(categoryId) {
  const response = await http.delete(
    `/api/v1/restaurants/me/menu-categories/${categoryId}`,
  );
  return response.data;
}
