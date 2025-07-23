import { ReasonPhrases, StatusCodes } from "http-status-codes";

import {
  middlewareEnsureSecretKey,
  middlewareLogging,
  middlewareStack,
} from "./middlewares.mjs";

export const withSecretKey = middlewareStack(
  middlewareLogging,
  middlewareEnsureSecretKey(process.env.SECRET_KEY ?? "42")
);

export function createDefaultRoutes() {
  return {
    "GET /healthcheck": async (_req, res) => {
      res.status(StatusCodes.OK).send({
        pid: process.pid,
      });
    },
    "GET /": withSecretKey(async (req, res) => {
      res.status(StatusCodes.OK).send({
        message: "Hello, world",
        query: req.query,
      });
    }),
  };
}

export function matchRouterHandler(routerMap, req) {
  const urlParts = req.url.pathname.split("/");

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

function notFoundHandler(_req, res) {
  res.writeHead(StatusCodes.NOT_FOUND);
  res.end(ReasonPhrases.NOT_FOUND);
}
