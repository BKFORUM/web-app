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
    createAt: string
    documents: IDocuments[]
    status: string
    updateAt: string
}