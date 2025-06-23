FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

RUN npm install nodemon --global

CMD nodemon --ext ts,json,html,scss \
  --legacy-watch \
  --watch apps/chess-ui \
  --watch libs \
  --exec "npx nx build chess-ui --source-map=true"
