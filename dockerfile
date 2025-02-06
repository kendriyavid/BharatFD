# Use a specific Node.js version (v23.5.0 in your case) as the base image
FROM node:23.5.0
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Define the command to start your app
CMD ["npm", "start"]
