import { WebSocket } from "ws";

export type UserData = Map<WebSocket, { userId: string, chatId: string }>

export interface Chat {
    [chatId: string]: Set<WebSocket>
}