# -------- Stage 1: Build --------
FROM node:22 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build React app (TypeScript compiles here)
RUN npm run build

# -------- Stage 2: Production --------
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]