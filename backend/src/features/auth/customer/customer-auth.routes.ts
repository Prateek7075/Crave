import { Router } from "express";

import { validateRequest } from "../../../common/middleware/validate-request.js";

import { customerRequestCodeBodySchema } from "./customer-auth.schemas.js";
import { requestCustomerCodeController } from "./customer-auth.controller.js";

export const customerAuthRouter = Router();

customerAuthRouter.post(
  "/request-code",
  validateRequest({
    body: customerRequestCodeBodySchema,
  }),
  requestCustomerCodeController,
);
