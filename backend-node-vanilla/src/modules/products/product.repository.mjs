export default class ProductRepository {
  constructor({ db }) {
    this.db = db;
  }

  async findAll(limit = 1000) {
    return this.db.collection('products').find({}, { limit }).toArray();
  }

  async getById(sku) {
    return this.db.collection('products').findOne({ sku });
  }
}
