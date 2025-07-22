import http from "node:http";
import { ListenOptions } from "node:net";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { matchRouterHandler } from "./routes";
import { Handler, Request, Response } from "./types";

export function createServer(
  serverOptions: http.ServerOptions,
  routerMap: Record<string, Handler>
): http.Server {
  const handler = async (
    incomingMessage: http.IncomingMessage,
    serverResponse: http.ServerResponse
  ) => {
    const url = new URL(
      incomingMessage.url ?? "/",
      `http://${incomingMessage.headers.host ?? "localhost"}`
    );

    const req: Request = {
      urlObj: url,
      headers: incomingMessage.headers as Record<string, string | string[]>,
      method: incomingMessage.method ?? "GET",
      query: Object.fromEntries(url.searchParams.entries()),
      params: {},
    };

    const res: Response = {
      statusCode: StatusCodes.OK,
      status: function (statusCode: number): Response {
        this.statusCode = statusCode;
        return this;
      },
      send: function (data: unknown): Response {
        serverResponse.writeHead(this.statusCode, {
          "Content-Type": "application/json",
        });
        serverResponse.end(JSON.stringify(data));
        return this;
      },
    };

    const routerHandler = matchRouterHandler(routerMap, req);
    try {
      await routerHandler(req, res);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
      errorHandler(err);
    }
  };

  return http.createServer(serverOptions, handler);
}

type ListenWithGracefulShutdownParams = {
  server: http.Server;
  listenOptions: ListenOptions;
  handleShutdown: () => void;
};

export function listenWithGracefulShutdown({
  server,
  listenOptions,
  handleShutdown,
}: ListenWithGracefulShutdownParams): void {
  server.listen(listenOptions, () => {
    console.info(
      `SERVER: PID ${process.pid} Server listening in ${JSON.stringify(
        listenOptions
      )}...`
    );
  });

  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);

  process.on("uncaughtException", errorHandler);
  process.on("unhandledRejection", errorHandler);
  server.on("error", errorHandler);
}

function errorHandler(err: unknown): void {
  console.error(`ERROR: ${err}`);
  process.exit(1);
}
