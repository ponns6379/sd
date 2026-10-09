FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=3000 UPLOAD_DIR=/data/uploads
RUN mkdir -p /data/uploads
EXPOSE 3000
CMD ["npm", "start"]
