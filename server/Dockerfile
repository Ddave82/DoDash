FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create empty data.json if it doesn't exist
RUN echo '{"lists":[],"keyColor":"#6B46C1"}' > data.json

EXPOSE 3001

CMD ["node", "server.js"]
