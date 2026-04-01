FROM node:20-alpine

WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Expose port map defined in vite.config.ts
EXPOSE 8080

# Start Vite development server
CMD ["npm", "run", "dev"]
