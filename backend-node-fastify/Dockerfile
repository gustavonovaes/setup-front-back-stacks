FROM node:20-alpine as base
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --only=production --no-optional --no-cache --silent --progress=false --no-fund --no-audit

FROM node:20-alpine
WORKDIR /app
RUN npm install -g pm2 --silent --progress=false --no-fund --no-audit
COPY --from=base /app .
COPY plugins /app/plugins
COPY app.js .
COPY ecosystem.config.cjs .
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]