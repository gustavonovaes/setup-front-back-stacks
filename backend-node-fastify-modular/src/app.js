import Fastify from "fastify";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import productRoutes from "./modules/products/product.routes.js";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
  },
});

await app.register(import("@fastify/cors"), {});

app.register(import("@fastify/helmet"), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
});

app.register(import("@fastify/rate-limit"), {
  max: process.env.RATE_LIMIT_MAX ?? 60,
  timeWindow: "1 minute",
});

app.register(import("./plugins/db.js"));

app.register(productRoutes, { prefix: "/api" });

app.setErrorHandler((error, req, reply) => {
  app.log.error(error);
  reply
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: ReasonPhrases[StatusCodes.INTERNAL_SERVER_ERROR] });
});

app.addHook("onClose", (instance, done) => {
  instance.log.info("Shutting down server");
  done();
});

process.on("SIGTERM", () => {
  app.log.info("SIGTERM signal received: closing HTTP server");
  app.close(() => {
    app.log.info("HTTP server closed");
  });
});

app.ready(() => {
  console.info(`Server ready:\n ${app.printRoutes()}`);
});

export default app;
