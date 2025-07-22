import ProductController from "./product.controller.mjs";
import ProductRepository from "./product.repository.mjs";
import ProductService from "./product.service.mjs";

import { middlewareEnsureSecretKey, middlewareStack } from "../../middlewares.mjs";

const withSecretKey = middlewareStack(
  middlewareEnsureSecretKey(process.env.SECRET_KEY ?? '42')
);


export default function productRoutes({ db }) {
  const productRepository = new ProductRepository({ db });
  const productService = new ProductService({ productRepository });
  const productController = new ProductController({ productService });

  return {
    'GET /products': withSecretKey(productController.getAll),
    'GET /products/:id': withSecretKey(productController.getById),
  };
}
