export default {
  type: "object",
  properties: {
    nome: { type: "string" },
    quantidade: { type: "number" },
  },
  required: ["nome", "quantidade"],
  additionalProperties: false,
};
