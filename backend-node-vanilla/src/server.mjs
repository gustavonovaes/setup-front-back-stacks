import http from 'node:http';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import { matchRouterHandler } from './routes.mjs';

export function createServer(serverOptions, routerMap = {}) {
  const handler = async (req, res) => {
    req.url = new URL(req.url, `http://${req.headers?.host ?? 'localhost'}`);
    req.query = Object.fromEntries(req.url.searchParams.entries());
    req.params = {};

    res.status = (statusCode) => {
      res.writeHead(statusCode, { 'Content-type': 'application/json' });
      return res;
    };
    res.send = (data) => {
      res.end(JSON.stringify(data));
    };

    const routerHandler = matchRouterHandler(routerMap, req);

    try {
      // TODO: implemente a timeout with Promice.race and reading serverOptions
      await routerHandler(req, res);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR
      });
      errorHandler(err);
    }
  };

  return http.createServer(serverOptions, handler);
}

export function listenWithGracefulShutdown({ server, listenOptons, handleShutdown }) {
  server.listen(listenOptons, () => {
    console.info(`SERVER: PID ${process.pid} Server listening in ${JSON.stringify(listenOptons)}...`);
  });

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  process.on('uncaughtException', errorHandler);
  process.on('unhandledRejection', errorHandler);
  server.on('error', errorHandler);
}

function errorHandler(err) {
  console.error(`ERROR: ${err}`);
  process.exit(1);
}