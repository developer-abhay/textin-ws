import { createClient } from 'redis';

const redisClient = createClient();
const publisher = createClient();

export const connectToRedis = async () => {
    try {
        await redisClient.connect()
        await publisher.connect()
    } catch (error) {
        console.log('Error connecting to Redis')
    }
}

export const pushToQueue = () => {
    try {

    } catch (error) {
        console.log('Error Pushing to Queue')
    }
}