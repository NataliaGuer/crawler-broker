import * as amqp from "amqplib";
import { log } from "console";

log("broker started");

amqp.connect(process.env.MESSAGE_QUEUE).then((connection) => {
  connection.createChannel().then((channel) => {
    channel.assertQueue(process.env.QUEUE);
    channel.consume(process.env.QUEUE, (msg) => {
      console.log(msg);
    });
  });
});
