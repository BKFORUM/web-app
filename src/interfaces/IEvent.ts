import { IDocuments } from "./IPost"

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
}