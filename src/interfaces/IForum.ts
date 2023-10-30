import { IUserData } from "./IUser"

export interface ITopic {
    id: string
    name: string
}

export interface IUserForumResponse {
    id: string
    name: string
    createdAt: string
    status: string
    type: string
    moderator: IUserData
    topics: [
        topic: ITopic
    ]
    _count: {
        users: number
    }
}

export interface IForumDetail {
    name: string
    moderator: IUserData
    topics?: [{
        topic: ITopic
    }]
    users: [{
        user: IUserData
    }]
}