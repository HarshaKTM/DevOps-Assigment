FROM node:18-alpine

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
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application with ts-node
CMD ["npx", "nodemon", "--exec", "ts-node", "src/index.ts"] 