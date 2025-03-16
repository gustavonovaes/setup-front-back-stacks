# Frontend - Vite - Vanilla

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

## Por que usar o Vite?

O Vite é uma ferramenta utilizada para construir aplicações web. Ele é rápido, leve e fácil de usar. Oferecendo templates para vários frameworks e bibliotecas, como React, Vue, Svelte, Vanilla, Lit, etc. e suporte para preprocessadores de CSS, TypeScript, multi-page app, server-side rendering, static site generation, hot module replacement, etc.

## Instalar e configurar o Vite

```bash
npm create vite@latest frontend --template vanilla -y
# Select the vanilla template, javascript
cd frontend
npm install
npm run dev
```

## Configurar novas paginas no Vite

Sem essa configuração, após buildar o projeto, o arquivo `produtos.html` não será gerado no diretório `dist` e não será possível acessar a página `produtos.html` no navegador. Veja mais sobre em https://vite.dev/guide/build.html#multi-page-app.

```bash
touch vite.config.js
```

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        produtos: "produtos.html",
      },
    },
  },
});
```

## SPA - Single Page Application

Se for construir um SPA através de algum framework, precisa configurar o servidor HTTP para redirecionar todas as rotas para o arquivo `index.html`.