import { WebSocketServer } from "ws";
import { connectToRedis, publisher, subscriber } from "./services/redis";
import { chats, userData } from "./golbals/globals";

import { verifyCookies } from "./middleware/Auth";

function initWS() {
    const port = Number(process.env.PORT) || 4005
    const server = new WebSocketServer({ port })
    console.log('Web socket server running on port: ', port)

    server.on('connection', (ws, req) => {
        // Check for cookies to verify user
        // let user;
        // const cookies = req.headers.cookie;
        // console.log(cookies)
        // if (cookies) {
        //     user = verifyCookies(cookies, ws);
        // }
        // else {
        //     console.log('Invalid Cookies')
        //     ws.close(4001, "Unauthorized: No cookies found");
        //     return;
        // }
        // if (user) {
        console.log('Client has connected')

        ws.on('message', async (message) => {
            const { type, chatId, payload }: { type: string, chatId: string, payload: string } = JSON.parse(message.toString());

            if (type == 'join') {
                // verify room
                // Verify user in room
                if (chats[chatId]) {
                    chats[chatId].add(ws)
                } else {
                    chats[chatId] = new Set()
                    chats[chatId].add(ws)
                }
                userData.set(ws, { userId: 'userID', chatId })

                await subscriber.subscribe(chatId, (message) => {
                    const data = message.toString();
                    console.log(data)
                    // CLIENTS_LIST[orderbookId].forEach((client) => {
                    //     client.send(orderbook);
                    // });

                    chats[chatId].forEach((client) => {
                        client.send('hello');
                    })
                });

            } else if (type == 'message') {
                publisher.publish(chatId, JSON.stringify({ type: 'send-message', payload }))
                // Publish to the pubsub
                // push to the queue for server to pull and then push to db
            } else if (type == 'leave') {
                // check chatid
                // check user in chatid
                // remove user
                chats[chatId].delete(ws)

                userData.set(ws, { userId: 'userID', chatId: '' })

                await subscriber.unsubscribe(chatId, (message) => {
                    const data = message.toString();
                    console.log(data)
                    // CLIENTS_LIST[orderbookId].forEach((client) => {
                    //     client.send(orderbook);
                    // });

                    chats[chatId].forEach((client) => {
                        client.send('hello');
                    })
                });

                // if number of users 0 , remove chatId
            }
        })

        ws.on('error', (message) => {
            const data = message.toString();
        })

        ws.on('close', () => {
            console.log('Client disconnected');
        })
        // }
    })
}


connectToRedis(); // Connecting to redis
initWS();         // Initializing websocket connection


