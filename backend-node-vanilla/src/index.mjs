import 'dotenv/config';
import { cpus } from "node:os";
import cluster from "node:cluster";

import { createServer, listenWithGracefulShutdown } from "./server.mjs";
import { createDefaultRoutes } from "./routes.mjs";

import {
  closeDatabaseConnection,
  createDatabaseConnection,
} from "./infra/db.mjs";
import createProductRoutes from "./modules/products/product.routes.mjs";

const numCPUs = Math.min(cpus().length, process.env.MAX_NUM_CPUS ?? 8);
const ERROR_CODE_SHUTDOWN = 255;

if (cluster.isPrimary) {
  console.info(
    `SERVER: Master PID ${process.pid} - Forking ${numCPUs} worker(s)...`
  );
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code) => {
    console.info(
      `SERVER: Worker ${worker.process.pid} exited with code "${code}". Restarting...`
    );
    if (code !== ERROR_CODE_SHUTDOWN) {
      cluster.fork();
    }
  });
} else {
  let db;
  try {
    console.info("SERVER: Connecting to DB...");
    db = await createDatabaseConnection(process.env.DB_URI ?? "");
  } catch (err) {
    console.error(`ERROR: Can't connect to DB: ${err}`);
    process.exit(ERROR_CODE_SHUTDOWN);
  }
  console.info("SERVER: Connected to database");

  const routes = {
    ...createDefaultRoutes(),
    ...createProductRoutes({ db }),
  };

  const serverOptions = {
    requestTimeout: parseInt(process.env.SERVER_REQUEST_TIMEOUT ?? "3000"),
  };

  const server = createServer(serverOptions, routes);

  const listenOptions = {
    port: process.env.PORT ?? "3000",
    host: process.env.HOST ?? "0.0.0.0",
  };

  listenWithGracefulShutdown({
    server,
    listenOptions,
    handleShutdown: handleShutdown({ db, server }),
  });
}

function handleShutdown({ db, server }) {
  return async () => {
    console.info(`SERVER: SIGNAL received, closing server...`);

    if (db) {
      console.info(`SERVER: Closing database...`);
      await closeDatabaseConnection();
    }

    server.close(() => {
      console.info(`SERVER: Server closed gracefully`);
      process.exit(0);
    });
  };
}
