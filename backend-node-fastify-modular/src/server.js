import app from "./app.js";

try {
  await app.listen({ port: process.env.PORT ?? 5000, host: "0.0.0.0" });
} catch (err) {
  app.log.error(`runServer: ${err}`);
  process.exit(1);
}
