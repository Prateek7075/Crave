import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

import { pinoHttp, type Options } from "pino-http";

import { logger } from "../../config/logger.js";

function getRequestId(header: string | string[] | undefined): string {
  const candidate = Array.isArray(header) ? header[0] : header;

  if (typeof candidate === "string") {
    const trimmedCandidate = candidate.trim();

    if (trimmedCandidate.length > 0 && trimmedCandidate.length <= 100) {
      return trimmedCandidate;
    }
  }

  return randomUUID();
}

const httpLoggerOptions: Options<IncomingMessage, ServerResponse> = {
  logger,

  genReqId(request, response) {
    const requestId = getRequestId(request.headers["x-request-id"]);

    response.setHeader("x-request-id", requestId);

    return requestId;
  },

  /*
   * Pass the original Node request and response objects to our
   * serializers instead of already-serialized objects.
   */
  wrapSerializers: false,

  serializers: {
    req(request: IncomingMessage) {
      return {
        id: request.id,
        method: request.method,
        url: request.url,
        remoteAddress: request.socket.remoteAddress,
        userAgent: request.headers["user-agent"],
      };
    },

    res(response: ServerResponse) {
      return {
        statusCode: response.statusCode,
      };
    },
  },

  customLogLevel(_request, response, error) {
    if (error || response.statusCode >= 500) {
      return "error";
    }

    if (response.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  customSuccessMessage(request, response, _responseTime) {
    return `${request.method} ${request.url} completed with ${response.statusCode}`;
  },

  customErrorMessage(request, response, _error) {
    return `${request.method} ${request.url} failed with ${response.statusCode}`;
  },
};

export const httpLogger = pinoHttp(httpLoggerOptions);
