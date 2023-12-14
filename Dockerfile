# Use an official Node runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nest CLI to use it for development purposes
RUN npm install -g @nestjs/cli

# Copy the rest of your app's source code
COPY . .

# Your app binds to port 3000 (default for NestJS), so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Use the Nest CLI to start the app in watch mode
CMD ["nest", "start", "--watch"]
