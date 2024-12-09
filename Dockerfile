FROM node:20-alpine

RUN mkdir -p home/app
WORKDIR /home/app


COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npx tsc

CMD npx tsc && node dist/app.js