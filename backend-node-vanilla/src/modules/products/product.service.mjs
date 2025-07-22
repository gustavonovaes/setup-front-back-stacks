export default class ProductService {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  getAll() {
    return this.productRepository.findAll();
  }

  getById(id) {
    return this.productRepository.getById(id);
  }
}
