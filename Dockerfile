 # FRONTEND BUILD
FROM node:18 as frontend
WORKDIR /app
COPY public/package*.json ./public/
WORKDIR /app/public
RUN npm install
COPY public/ .
RUN npm run build

# BACKEND BUILD
FROM node:18
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install
COPY server/ .
COPY --from=frontend /app/public/build ./public/build

EXPOSE 5000
CMD ["node", "index.js"]
