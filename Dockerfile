# Dockerfile para E-Kids-PRO MVP (Full-stack Node.js/Express)
FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema para better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./

# Copiar .env
COPY .env* ./

# Instalar dependências (todas, não só production)
RUN npm install

# Copiar código
COPY . .

# Criar diretório para banco de dados
RUN mkdir -p server/database

EXPOSE 3000

CMD ["npm", "start"]
