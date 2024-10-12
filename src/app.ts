import * as amqp from "amqplib";
import { PrismaClient } from "@prisma/client";

console.log("broker started");

const pullQueue = process.env.BROKER_QUEUE;
const pushQueue = process.env.FETCHER_QUEUE;

const firstJob = {
  host: "https://en.wikipedia.org",
  url: "https://en.wikipedia.org/wiki/Portal:Computer_programming",
};

const prisma = new PrismaClient();

amqp.connect(process.env.MESSAGE_QUEUE).then((connection) => {
  connection.createChannel().then((channel) => {
    channel.assertQueue(pushQueue).then(() => {
      channel.sendToQueue(pushQueue, Buffer.from(JSON.stringify(firstJob)));
    });

    channel.assertQueue(pullQueue).then(() => {
      channel.consume(pullQueue, (msg) => {
        const msgContent = JSON.parse(msg.content.toString());

        prisma.site_info
          .findFirst({
            where: {
              url: msgContent["url"],
            },
          })
          .then((job) => {
            if (!job) {
              //se il job non è stato trovato allora inseriamo il messaggio in coda
              channel.sendToQueue(pushQueue, Buffer.from(msg.content.toString()));
            }
          });
      });
    });
  });
});
