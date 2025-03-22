import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class ProductController {
  constructor(productService) {
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

      return 
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: ReasonPhrases[StatusCodes.NOT_FOUND] });
    }
  };

  create = async (req, res) => {
    const { nome, quantidade } = req.body;
    const product = await this.productService.create({ nome, quantidade });
    return res.status(StatusCodes.CREATED).send(product);
  };
}
