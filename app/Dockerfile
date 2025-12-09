# Base image
FROM node:20-alpine

# Create working directory
WORKDIR /usr/src/app

# Copy package json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build NestJS app
RUN npm run build

# Expose the port from .env
EXPOSE 3000

# Set environment to production by default
ENV NODE_ENV=production

# Run app
CMD ["npm", "run", "start:dev"]
