FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# React dev server on 3000
EXPOSE 3000

# For dev, we'll mount src/ into the container as a volume
CMD ["npm", "run", "start"]