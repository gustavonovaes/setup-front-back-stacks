import fp from "fastify-plugin";
import Database from "better-sqlite3";

async function dbPlugin(fastify, opts) {
  const db = new Database(process.env.DB_PATH || "db.sqlite");

  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL
    );
  `);

  fastify.decorate("db", db);

  fastify.addHook("onClose", (instance, done) => {
    instance.log.info("Closing database connection");
    db.close();
    done();
  });
}

export default fp(dbPlugin);
