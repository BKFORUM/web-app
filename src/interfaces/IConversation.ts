import { IUserData } from "./IUser"

export interface IConversation {
    id: string,
    avatarUrl: string,
    displayName: string
    lastMessage: IMessage | null
    users: IUserData[]
}

export interface IMessage {
    id?: string
    type: string
    content: string,
    author: IUserData,
    createdAt: string,
    userId?: string
}