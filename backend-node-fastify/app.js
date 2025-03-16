import Fastify from "fastify";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const app = Fastify({
  logger: true,
});

await app.register(import("@fastify/cors"), {});

app.register(import("./plugins/db.js"));

app.register(
  async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
      const produtos = fastify.db.prepare("SELECT * FROM produtos").all();
      return produtos;
    });

    fastify.get("/:id", async function (request, reply) {
      const { id } = request.params;
      const produto = fastify.db
        .prepare("SELECT * FROM produtos WHERE id = ?")
        .run(id);
      if (!produto) {
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ message: ReasonPhrases[StatusCodes.NOT_FOUND] });
      }

      return {};
    });

    fastify.post("/", async function (request, reply) {
      const { nome, quantidade } = request.body;
      const novoProduto = {
        nome,
        quantidade,
      };

      const { lastInsertRowid } = fastify.db
        .prepare(`INSERT INTO produtos (nome, quantidade) VALUES (?, ?)`)
        .run(novoProduto.nome, novoProduto.quantidade);
      novoProduto.id = lastInsertRowid;
      return novoProduto;
    });

    fastify.put("/:id", async function (request, reply) {
      const { id } = request.params;
      const produto = fastify.db.select(
        "SELECT * FROM produtos WHERE id = ?",
        id
      );
      if (!produto) {
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ message: ReasonPhrases[StatusCodes.NOT_FOUND] });
      }

      const { nome, quantidade } = request.body;
      const novoProduto = {
        id,
        nome,
        quantidade,
      };

      fastify.db
        .prepare(
          `UPDATE produtos SET 
          nome = ?, 
          quantidade = ?
        WHERE id = ?`
        )
        .run(novoProduto.nome, novoProduto.quantidade, produto.id);
      return novoProduto;
    });

    fastify.delete("/:id", async function (request, reply) {
      const { id } = request.params;
      const produto = reply
        .db()
        .select("SELECT * FROM produtos WHERE id = ?", id);
      if (!produto) {
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ message: ReasonPhrases[StatusCodes.NOT_FOUND] });
      }

      fastify.db.prepare(`DELETE FROM produtos WHERE id = ?`).run(produto.id);
      return {};
    });
  },
  { prefix: "/api/produtos" }
);

app.addHook("onClose", (instance, done) => {
  instance.log.info("Shutting down server");
  done();
});

try {
  await app.listen({ port: process.env.PORT ?? 3000, host: "0.0.0.0" });
} catch (err) {
  app.log.error(`runServer: ${err}`);
  process.exit(1);
}
