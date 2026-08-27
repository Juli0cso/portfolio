# Build isolado: as dependências são instaladas dentro da imagem, para o
# resultado não depender do que existe na máquina que dispara o deploy.
FROM node:22-slim AS builder
WORKDIR /app

# package.json e lockfile primeiro: enquanto eles não mudam, o Docker reaproveita
# a camada de instalação e o deploy não baixa tudo de novo.
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA: qualquer rota desconhecida devolve o index, senão um F5 fora da raiz dá 404.
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
