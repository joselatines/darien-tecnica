# Step 1: Use a Node.js image to build the app
FROM node:20

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

# Expose port 
EXPOSE 8085

# Start Nginx server
CMD ["yarn", "run", "preview", "--port", "8085", "--host", "0.0.0.0"]