FROM node:24

WORKDIR /app

COPY package*.json .

RUN npm ci --force

COPY . .

CMD npx nx serve chess-ui --host=0.0.0.0 --poll=100
