FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

RUN npm install nodemon --global

CMD nodemon --ext ts,json \
  --legacy-watch \
  --watch apps \
  --watch libs \
  --exec "npx nx build notification-service && node --inspect=0.0.0.0:4303 dist/apps/notification-service/main.js"
