export interface IDocuments {
    id: string;
    createAt: string;
    fileName: string;
    fileUrl: string;
    postId: string;
    updateAt: string;
    userId: string;
}

export interface IPostViewForum {
    id: string;
    content: string;
    createdAt: string
    documents: IDocuments[]
    status: string
    updateAt: string
    forum: {
        name: string
        fileUrl: string
        modId: string
    }
    user: {
        id: string
        fullName: string
        avatarUrl: string
    }
}