FROM node:18.2.0-alpine3.14
WORKDIR /app/user-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8002
CMD ["npm", "run", "dev"]