import { IUserData } from "./IUser"

export interface ITopic {
    id: string
    name: string
}

export interface IOption extends ITopic {

}

export interface IUserForumResponse {
    id: string
    name: string
    createdAt: string
    status: string
    avatarUrl?: string
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