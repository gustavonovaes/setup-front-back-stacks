import ProductController from "./product.controller.js";
import ProductRepository from "./product.repository.js";
import ProductService from "./product.service.js";

import createProductSchema from "./schemas/createProduct.schema.js";

export default async function productRoutes(fastify, opts) {
  const productRepository = new ProductRepository(fastify.db);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  fastify.get("/produtos", productController.getAll);
  fastify.get("/produtos/:id", productController.getById);
  fastify.post(
    "/produtos",
    { schema: createProductSchema },
    productController.create
  );
}
