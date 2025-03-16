const API_URL = "http://localhost:5000/api";

export function getProdutos() {
  return fetch(`${API_URL}/produtos`).then((res) => res.json());
}

export function addProduto({ nome, quantidade }) {
  const payload = JSON.stringify({ nome, quantidade });
  return fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  }).then((res) => res.json());
}
