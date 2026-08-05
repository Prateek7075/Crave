import http from "../../../../lib/http.js";
import { parseApiError } from "../../../../lib/apiError.js";

function toApiPayload(address) {
  return {
    label: address.label,
    recipient_name: address.recipientName,
    address_line_1: address.addressLine1,
    address_line_2: address.addressLine2 || null,
    landmark: address.landmark || null,
    latitude: address.latitude,
    longitude: address.longitude,
    delivery_instructions: address.deliveryInstructions || null,
  };
}

export async function getCustomerAddresses() {
  try {
    const response = await http.get("/api/v1/customer/addresses");

    return response.data.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function getCustomerAddress(addressId) {
  try {
    const response = await http.get(`/api/v1/customer/addresses/${addressId}`);

    return response.data.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function createCustomerAddress(address) {
  try {
    const response = await http.post(
      "/api/v1/customer/addresses",
      toApiPayload(address),
    );

    return response.data.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function updateCustomerAddress(addressId, address) {
  try {
    const response = await http.put(
      `/api/v1/customer/addresses/${addressId}`,
      toApiPayload(address),
    );

    return response.data.data;
  } catch (error) {
    throw parseApiError(error);
  }
}

export async function deleteCustomerAddress(addressId) {
  try {
    await http.delete(`/api/v1/customer/addresses/${addressId}`);
  } catch (error) {
    throw parseApiError(error);
  }
}
