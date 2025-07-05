# Use lightweight Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy code and CSV file
COPY . .

# Expose the app port
EXPOSE 3036

# Start the server
CMD ["node", "server.js"]
