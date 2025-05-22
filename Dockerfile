# Use Node.js as the base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy all files
COPY . .

# Install dependencies
RUN yarn install --cache-folder .yarn-cache

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["yarn", "start"]
