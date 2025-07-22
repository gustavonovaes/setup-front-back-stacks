import ProductRepository from "./product.repository";

export default class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getAll() {
    return this.productRepository.findAll();
  }

  getById(id: string) {
    return this.productRepository.getById(id);
  }
}
