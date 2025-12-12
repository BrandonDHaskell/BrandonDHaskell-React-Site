# server/server/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# For dev, src/ is mounted, and run nodemon/ts-node/etc
CMD ["npm", "run", "dev"]