import { IUserData } from "./IUser"

export interface IConversation {
    id: string,
    avatarUrl: string,
    displayName: string
    lastMessage: IMessage | null
    users: IUserData[]
    type: string
    isRead?: boolean
}

export interface IMessage {
    id?: string
    type: string
    content: string,
    author: IUserData,
    createdAt: string,
    updatedAt: string,
    conversationId?: string,
    userId?: string
}