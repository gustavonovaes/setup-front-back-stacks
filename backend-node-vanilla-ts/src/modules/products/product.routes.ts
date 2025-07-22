import mongodb from 'mongodb';

import ProductController from "./product.controller";
import ProductRepository from "./product.repository";
import ProductService from "./product.service.js";

import { middlewareEnsureSecretKey, middlewareStack } from "@/middlewares";

const withSecretKey = middlewareStack(
  middlewareEnsureSecretKey(process.env.SECRET_KEY ?? "42")
);

type ProductRoutesParams = {
  db: mongodb.Db;
};

export default function productRoutes({ db }: ProductRoutesParams) {
  const productRepository = new ProductRepository(db);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  return {
    "GET /products": withSecretKey(productController.getAll),
    "GET /products/:id": withSecretKey(productController.getById),
  };
}
