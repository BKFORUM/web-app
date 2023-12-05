import { IUserData } from "./IUser"

export interface ITopic {
    id: string
    name: string
}

export interface IOption extends ITopic {

}

export interface IFormDataForum {
    id?: string
    name: string
    moderatorId: string
    avatarUrl?: string
    type: string
    topicIds: string[]
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

export interface IUserForumResponseUpdated extends Omit<IUserForumResponse, 'topics'> {
    topics: ITopic[];
    yourStatus: string;
}



export interface IForumDetail {
    name: string
    avatarUrl?: string
    moderator: IUserData
    topics?: [{
        topic: ITopic
    }]
    users: [{
        user: IUserData
    }]
    yourStatus: string
}