module.exports = {
  apps: [
    {
      name: "backend-node-fastify",
      script: "app.js",
      instances: "max", // Usa todos os núcleos disponíveis
      exec_mode: "cluster", // Modo cluster para melhor desempenho
      watch: false, // Evita reiniciar em mudanças
      autorestart: true, // Reinicia caso falhe
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
