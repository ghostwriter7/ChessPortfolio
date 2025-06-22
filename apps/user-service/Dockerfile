FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

CMD npx nodemon \
  --legacy-watch \
  --inspect=0.0.0.0:9229 \
  --watch . \
  --ext ts,json \
  --exec "node apps/user-service/src/main.ts"
