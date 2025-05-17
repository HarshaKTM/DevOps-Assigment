# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install ts-node and nodemon globally
RUN npm install -g ts-node nodemon

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=development
ENV PORT=4002

# Expose the port
EXPOSE 4002

# Start the application with ts-node
CMD ["npx", "nodemon", "--exec", "ts-node", "src/index.ts"] 