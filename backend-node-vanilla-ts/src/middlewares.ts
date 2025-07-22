import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { Request, Response, Handler, Middleware } from "@/types";

export function middlewareStack(...middlewares: Middleware[]): Middleware {
  return (handler: Handler): Handler => {
    return middlewares.reduceRight(
      (next, middleware) => middleware(next),
      handler
    );
  };
}

export function middlewareLogging(handler: Handler): Handler {
  return (req, res) => {
    console.info(
      `INFO: ${req.method} - ${req.urlObj.pathname} - ${JSON.stringify(
        req.query
      )}`
    );
    return handler(req, res);
  };
}

export function middlewareEnsureSecretKey(secretKey: string): Middleware {
  return (handler) => {
    return (req: Request, res: Response) => {
      if (secretKey !== req?.headers?.["secret-key"]) {
        console.info(`INFO: Secret key invalid or not provided`);
        res.status(StatusCodes.FORBIDDEN).send({
          message: ReasonPhrases.FORBIDDEN,
        });
        return;
      }

      return handler(req, res);
    };
  };
}
