# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and data
COPY src ./src
COPY data ./data

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]