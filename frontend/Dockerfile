# Step 1: Use a Node.js image to build the app
FROM node:20 as builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app’s source code
COPY . .

# Set build-time environment variable for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN yarn run build


# Step 2: Use an Nginx image to serve the static files
FROM nginx:alpine

# Copy the build files from the builder stage to the Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]