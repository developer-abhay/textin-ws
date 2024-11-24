import { WebSocketServer } from "ws";
import { connectToRedis } from "./services/redis";

function initWS() {
    const server = new WebSocketServer({ port: 4005 })

    server.on('connection', (ws) => {
        console.log('Client has connected')

        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());

            if (data.type == 'join') {
                // verify room 
                // verify user
                // Verify user in room 
                // Add to the map
            } else if (data.type == 'message') {
                // Publish to the pubsub
                // push to the queue for server to pull and then push to db
            } else if (data.type == 'leave') {
                // check chatid
                // check user in chatid
                // remove user
                // if number of users 0 , remove chatId
            }
        })

        ws.on('error', (message) => {
            const data = message.toString();
        })

        ws.on('close', () => {
            console.log('Client disconnected');
        })
    })
}


connectToRedis(); // Connecting to redis
initWS();         // Initializing websocket connection


