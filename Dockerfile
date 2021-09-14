# Get latest alpine linux distro
FROM alpine:latest

# Install Package Dependencies
RUN apk add --no-cache nodejs npm git

# Configure working directory inside docker image
WORKDIR /app

# Copy the nodejs app to docker image /app folder
COPY . .

ENV RUNNING_IN_DOCKER=true

#Install Yarn globally
RUN npm install -g yarn
