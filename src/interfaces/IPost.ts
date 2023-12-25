import { IUserData } from "./IUser";

export interface IDocuments {
    id: string;
    createAt: string;
    fileName: string;
    fileUrl: string;
    postId: string;
    updatedAt: string;
    userId: string;
}

export interface IUserLikePost {
    createdAt: string
    postId: string
    updatedAt: string
    userId: string
    user: IUserData
}

export interface IPostViewForum {
    id: string;
    content: string;
    createdAt: string
    documents: IDocuments[]
    status: string
    updatedAt: string
    likedAt: Date | null
    likes: IUserLikePost[]
    forum: {
        id: string
        name: string
        fileUrl: string
        modId: string
        avatarUrl: string
    }
    user: {
        id: string
        fullName: string
        avatarUrl: string
    }
    _count: {
        likes: number
        comments: number
    }
}

export interface IComment {
    id: string
    content: string
    postId: string
    createdAt: string
    updateAt: string
    userId: string
    user: IUserData
    replyComments: IComment[]
    _count?: {
        replyComments: number
    }
    commentId?: string

}

export interface IEditChild {
    id: string
    item: IComment
}

export interface IDataChild {
    id: string
    data: IComment[]
}

export interface IChildLoading {
    id: string
    isLoading: boolean
}

export interface ICountReply {
    id: string
    _count: number
}