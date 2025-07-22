import { ReasonPhrases, StatusCodes } from "http-status-codes";
import mongodb from "mongodb";

import {
  middlewareEnsureSecretKey,
  middlewareLogging,
  middlewareStack,
} from "@/middlewares";
import productRoutes from "@/modules/products/product.routes";
import { Handler, Request, Response } from "@/types";

type CreateRoutesParams = {
  db: mongodb.Db;
};

export function createRoutes({
  db,
}: CreateRoutesParams): Record<string, Handler> {
  const withSecretKey = middlewareStack(
    middlewareLogging,
    middlewareEnsureSecretKey(process.env.SECRET_KEY ?? "42")
  );

  const defaultRoutes = {
    "GET /healthcheck": async (req: Request, res: Response) => {
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

  return {
    ...defaultRoutes,
    ...productRoutes({ db }),
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
