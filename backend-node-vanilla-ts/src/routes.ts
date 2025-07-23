import { ReasonPhrases, StatusCodes } from "http-status-codes";

import {
  middlewareEnsureSecretKey,
  middlewareLogging,
  middlewareStack,
} from "@/middlewares";
import { Handler, Request, Response } from "@/types";

export const withSecretKey = middlewareStack(
  middlewareLogging,
  middlewareEnsureSecretKey(process.env.SECRET_KEY ?? "42")
);

export function createRoutes(): Record<string, Handler> {
  return {
    "GET /healthcheck": async (_req: Request, res: Response) => {
      res.status(StatusCodes.OK).send({
        pid: process.pid,
      });
    },
    "GET /": withSecretKey(async (req: Request, res: Response) => {
      res.status(StatusCodes.OK).send({
        message: "Hello, world",
        query: req.query,
      });
    }),
  };
}

export function matchRouterHandler(
  routerMap: Record<string, Handler>,
  req: Request
): Handler {
  const urlParts = req.urlObj.pathname.split("/");

  for (const route of Object.keys(routerMap)) {
    const [method, path] = route.split(" ");
    if (method !== req.method) {
      continue;
    }

    const routeParts = path.split("/");
    if (routeParts.length !== urlParts.length) {
      continue;
    }

    let match = true;
    for (const i in routeParts) {
      if (routeParts[i].startsWith(":")) {
        req.params[routeParts[i].slice(1)] = urlParts[i];
      } else {
        match = urlParts[i] === routeParts[i];
      }
    }

    if (match) {
      return routerMap[route];
    }
  }

  return notFoundHandler;
}

function notFoundHandler(_req: Request, res: Response): void {
  res.status(StatusCodes.NOT_FOUND).send({
    message: ReasonPhrases.NOT_FOUND,
  });
}
