import { Db } from "mongodb";

export default class ProductRepository {
  constructor(private db: Db) {}

  async findAll(limit = 1000) {
    return this.db.collection("products").find({}, { limit }).toArray();
  }

  async getById(sku: string) {
    return this.db.collection("products").findOne({ sku });
  }
}
