import http from "../../../lib/http.js";
import { parseApiError } from "../../../lib/apiError.js";

export async function getRestaurant() {
  try {
    const response = await http.get("/api/v1/restaurants/me");

    return response.data.data;
  } catch (error) {
    throw parseApiError(error);
  }
}
