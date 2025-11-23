# ---------- FRONTEND BUILD ----------
FROM node:18 AS frontend

WORKDIR /app/frontend

# Copy React package files
COPY public/package*.json ./
RUN npm install

# Copy all React project files
COPY public/ ./

# Build React
RUN npm run build


# ---------- BACKEND BUILD ----------
FROM node:18

WORKDIR /app

# Copy backend package.json and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy backend source code
COPY server/ ./

# Copy frontend build into backend
COPY --from=frontend /app/frontend/build ./public/build

EXPOSE 5000

# Start backend
CMD ["node", "index.js"]
