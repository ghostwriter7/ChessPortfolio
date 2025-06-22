FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

RUN npm install nodemon --global

CMD nodemon --ext ts,json \
  --legacy-watch \
  --watch apps/game-service \
  --watch libs \
  --exec "npx nx build game-service && node --inspect=0.0.0.0:4302 dist/apps/game-service/main.js"
