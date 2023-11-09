import { IFormDataForum } from "@interfaces/IForum";
import { IListUserRequest } from "@interfaces/IUser";
import BaseURL from "@utils/api/baseURL";

const getForumById = (id: string) => {
    return BaseURL({
        url: `/forums/` + id,
        method: "GET",
    });
}

const getAllTopic = () => {
    return BaseURL({
        url: `/topics`,
        method: "GET",
    });
}


const addForum = (data: Omit<IFormDataForum, 'id'>) => {
    return BaseURL({
        url: `/forums`,
        method: "POST",
        data,
    });
}

const editForum = (data: IFormDataForum) => {
    return BaseURL({
        url: `/forums/` + data.id,
        method: "PUT",
        data,
    });
}

const deleteUserFromForum = (data: any) => {
    return BaseURL({
        url: `/forums/${data.id}/requests`,
        method: "PATCH",
        data,
    });
}

const addUserToForum = (data: IListUserRequest) => {
    return BaseURL({
        url: `/forums/${data.id}/users`,
        method: "POST",
        data,
    });
}

export { getForumById, getAllTopic, addForum, editForum, deleteUserFromForum, addUserToForum }
