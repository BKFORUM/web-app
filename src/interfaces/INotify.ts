import { IUserData } from "./IUser";

export interface INotify {
    show: boolean;
    status: string;
    message: string;
}

export interface INotification {
    id: string,
    createdAt: string
    modelId: string
    modelName: string
    readAt: string
    updatedAt: string
    content: string
    sender: IUserData
}

