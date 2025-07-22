import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class ProductController {
  constructor({ productService }) {
    this.productService = productService;
  }

  getAll = async (req, res) => {
    const products = await this.productService.getAll();
    return res.send(products);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const product = await this.productService.getById(id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: ReasonPhrases[StatusCodes.NOT_FOUND] });
    }

    res.status(StatusCodes.OK).send({
      product,
    });
  };
}
