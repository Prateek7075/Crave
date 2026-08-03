import type { Request, Response } from "express";

import { getValidatedRequest } from "../../../common/middleware/validate-request.js";

import type { CustomerRequestCodeBody } from "./customer-auth.schemas.js";
import { requestCustomerCode } from "./customer-auth.service.js";

interface CustomerRequestCodeValidatedRequest {
  body: CustomerRequestCodeBody;
}

export async function requestCustomerCodeController(
  _request: Request,
  response: Response,
): Promise<void> {
  const validatedRequest = getValidatedRequest<CustomerRequestCodeValidatedRequest>(response);

  const result = await requestCustomerCode(validatedRequest.body);

  response.setHeader("Cache-Control", "no-store");

  response.status(200).json({
    success: true,
    data: result,
    message:
      result.nextStep === "ENTER_REGISTRATION_DETAILS"
        ? "Registration details are required"
        : "Verification code requested successfully",
  });
}
