FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

RUN npm install nodemon --global

CMD nodemon --ext ts,json \
  --legacy-watch \
  --watch libs \
  --watch apps \
  --exec "npx nx build user-service && node --inspect=0.0.0.0:4301 dist/apps/user-service/main.js"
