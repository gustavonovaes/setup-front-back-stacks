import { cpus } from 'node:os';
import cluster from 'node:cluster';

import { createServer, listenWithGracefulShutdown } from './server.mjs';
import { createRoutes } from './routes.mjs';

import { closeDatabaseConnection, createDatabaseConnection } from './infra/db.mjs';

const numCPUs = Math.min(cpus().length, process.env.MAX_NUM_CPUS ?? 8);

if (cluster.isPrimary) {
  console.info(`SERVER: Master PID ${process.pid} - Forking ${numCPUs} worker(s)...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.info(`SERVER: Worker ${worker.process.pid} exited with code "${code}". Restarting...`);
    cluster.fork();
  });
} else {
  console.info('SERVER: Connecting to DB...');

  let db;
  try {
    db = await createDatabaseConnection(process.env.DB_URI ?? '');
  } catch (err) {
    console.error(`ERROR: Can't connect to DB: ${err}`);
    process.exit(1);
  }
  console.info('SERVER: Connected to database');

  const routes = createRoutes({
    db,
  });

  const server = createServer({
    requestTimeout: process.env.SERVER_REQUEST_TIMEOUT ?? 3000
  }, routes);

  const handleShutdown = async () => {
    console.info(`SERVER: SIGNAL receibed, closing server...`);

    if (db) {
      console.info(`SERVER: Closing database...`);
      await closeDatabaseConnection();
    }

    server.close(() => {
      console.info(`SERVER: Server closed gracefully`);
      process.exit(0);
    });
  };

  listenWithGracefulShutdown({
    server,
    listenOptons: {
      port: process.env.PORT ?? '3000',
      host: process.env.HOST ?? '0.0.0.0',
    },
    handleShutdown,
  });
}