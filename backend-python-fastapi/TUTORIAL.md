# backend python 3.10

## Por que usar o Python?

Python é uma linguagem multiplataforma, possui uma grande comunidade, é open-source, possui uma grande quantidade de bibliotecas e frameworks e é utilizada em diversas áreas, como web, automação, data science, machine learning, etc.

## Instalar venv

```bash
sudo apt install python3.10-venv
```

## Criar ambiente virtual para aplicação

```bash
python3 -m venv venv
source venv/bin/activate # No Windows use venv\Scripts\activate
```

## Instalar dependencias

O `fastapi` é um framework para criar APIs com Python.
O `sqmodel` é um ORM para trabalhar com banco de dados SQL.
O `uvicorn` é um servidor ASGI para rodar a aplicação.

```bash
pip install flask flask-cors flask-sqlalchemy

# Salvar as dependências em um arquivo `requirements.txt`
pip freeze > requirements.txt
```

## API REST

API REST é um conjunto de regras e práticas para criar APIs. A sigla significa Representational State Transfer, que é um estilo arquitetural para sistemas distribuídos.

Exemplo de como definir as rotas para o recurso `produtos`:

- GET /api/v1/**produtos** - Lista todos os produtos
- GET /api/v1/**produtos**/1 - Retorna o produto com id 1
- POST /api/v1/**produtos** - Cria um novo produto
- PUT /api/v1/**produtos**/1 - Atualiza o produto com id 1
- PATCH /api/v1/**produtos**/1 - Atualiza parcialmente o produto com id 1
- DELETE /api/v1/**produtos**/1 - Deleta o produto com id 1

Algumas regras importantes para criar uma API REST:

- Utilizar verbos HTTP
- Utilizar plural para os recursos
- Utilizar status code para indicar o resultado da operação
- Utilizar JSON para enviar e receber dados
- Utilizar CORS para permitir que outros domínios acessem a API
- Utilizar autenticação para proteger a API
- Utilizar HTTPS para proteger a comunicação
- Utilizar versionamento para manter a compatibilidade
- Utilizar cache para melhorar a performance
- Utilizar logs para monitorar a API
- Utilizar testes para garantir a qualidade
- Utilizar documentação para facilitar o uso
- Utilizar rate limit para excesso de requisições

Alguns conceitos importantes sobre REST:

- REST é um estilo arquitetural, não é um protocolo
- RESTful é uma API que segue os princípios REST
- REST é baseado em recursos, não em métodos
