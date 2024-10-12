FROM node:20-alpine

RUN mkdir -p home/app
WORKDIR /home/app


COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npx tsc

# Start RabbitMQ in the background and your Node.js app
CMD npm install && npx tsc && node dist/app.js

# CMD ["node", "dist/app.js"]