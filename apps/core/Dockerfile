FROM node:22-alpine

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose dev port
EXPOSE 4000

# Run dev with ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
