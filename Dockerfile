# Use an official Node.js runtime as the base image
FROM node:21

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your API will run on
EXPOSE 5000

# Start the Node.js API
CMD ["npm", "start"]
