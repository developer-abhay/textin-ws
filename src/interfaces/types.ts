import { WebSocket } from "ws";

export interface Chat {
    [chatId: string]: WebSocket[]
}