# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/server ./server
COPY package*.json ./
RUN npm install --production

# Create data directory for JSON storage
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 8080
CMD ["node", "server/index.js"]
