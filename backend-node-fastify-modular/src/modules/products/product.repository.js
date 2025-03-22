export default class ProductRepository {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare("SELECT * FROM produtos").all();
  }

  getById(id) {
    return this.db.prepare("SELECT * FROM produtos WHERE id = ?").run(id);
  }

  create({ nome, quantidade }) {
    const novoProduto = {
      nome,
      quantidade,
    };

    const { lastInsertRowid } = this.db
      .prepare(`INSERT INTO produtos (nome, quantidade) VALUES (?, ?)`)
      .run(novoProduto.nome, novoProduto.quantidade);
    novoProduto.id = lastInsertRowid;
    return novoProduto;
  }
}
