# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose the port the app runs on
EXPOSE 3002

# Create non-root user for security
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser
    
# Give non-root user ownership
RUN chown -R appuser:appuser /app
USER appuser

# Set health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

# Start the application
CMD ["node", "src/index.js"] 