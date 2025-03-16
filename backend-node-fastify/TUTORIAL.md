# backend-node-fastify

## Instalar NVM

NVM é um gerenciador de versões do Node.js e NPM. Ele permite que você instale e gerencie várias versões em um único sistema.

Depois de usar o comando `nvm use <versao>` o node e npm daquela versão ficam disponíveis no PATH do shell.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
nvm install --lts
nvm use --lts # Usa a versão LTS do Node.js

node -v # v22.14.0
npm -v # 10.9.2
```

## Por que usar o Fastify?

O Fastify é um framework web para Node.js que é rápido, fácil de usar e seguro. Baseado no Express, ele é mais rápido e mais leve, com suporte para plugins e middlewares.

## Instalar e configurar o Fastify

```bash
npm init fastify@latest -y
```

## Instalar dependências

O `fastify` é um framework para criar APIs com Node.js.
O `sqlite3` é um banco de dados SQL.
O `better-sqlite3` é um wrapper para o SQLite3.
O `http-status-codes` é uma lib com a coleção de status codes HTTP.

```bash 
npm install @fastify/cors sqlite3 better-sqlite3 http-status-codes 
```