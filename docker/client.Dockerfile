# Build-only container — produces static assets, no running service
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the production bundle into /app/build
RUN npm run build