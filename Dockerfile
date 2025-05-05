FROM node:18-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=dev

EXPOSE 3001

CMD ["node", "dist/index.js"] 