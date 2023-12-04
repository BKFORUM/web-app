import { IDocuments } from "./IPost"
import { IUserData } from "./IUser"

export interface IEvent {
    id?: string
    displayName: string
    location: string
    startAt: string
    endAt: string
    interested?: number
    status?: string
    content: string
    documents?: IDocuments[]
    isSubscriber?: boolean
    users: {
        userId: string
        user: IUserData
    }[]
}