FROM node:18.2.0-alpine3.14
WORKDIR /app/notification-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8001
CMD ["npm", "run", "dev"]