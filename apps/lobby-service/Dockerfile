FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

RUN npm install nodemon --global

CMD nodemon --ext ts,json \
  --legacy-watch \
  --watch apps/lobby-service \
  --watch libs \
  --exec "npx nx build lobby-service && node --inspect=0.0.0.0:4304 /dist/apps/lobby-service/main.js"
