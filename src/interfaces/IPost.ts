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

export interface IPostViewForum {
    id: string;
    content: string;
    createdAt: string
    documents: IDocuments[]
    status: string
    updatedAt: string
    likedAt: Date | null
    forum: {
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

}