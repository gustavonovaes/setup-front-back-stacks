import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { Request, Response } from "@/types";

import ProductService from "./product.service";

export default class ProductController {
  constructor(private productService: ProductService) {}

  public getAll = async (_req: Request, res: Response) => {
    const products = await this.productService.getAll();
    res.send(products);
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getById(id);
    if (!product) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: ReasonPhrases.NOT_FOUND });
      return;
    }

    res.status(StatusCodes.OK).send({
      product,
    });
  };
}
