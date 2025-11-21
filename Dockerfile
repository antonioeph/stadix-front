#  Node versión LTS
FROM node:25-alpine

WORKDIR /app

# dependencias
COPY package.json package-lock.json* ./

# intalacion de dependencias
RUN npm install

# se copia resto del código
COPY . .

# se expone el puerto de Next.js
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "run", "dev"]