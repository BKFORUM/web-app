import { IFormDataForum } from "@interfaces/IForum";
import { IListUserRequest } from "@interfaces/IUser";
import BaseURL from "@utils/api/baseURL";

const getAllForum = (params: any) => {
    return BaseURL({
        url: `/forums`,
        method: "GET",
        params,
    });
}

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

const updateStatusUserFromForum = (data: any) => {
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

const getAllUserRequest = (id: string) => {
    return BaseURL({
        url: `/forums/${id}/requests`,
        method: "GET",
    });
}

const requestOnForum = (id: string) => {
    return BaseURL({
        url: `/forums/${id}/requests`,
        method: "POST",
    });
}

export { getForumById, getAllTopic, addForum, editForum, updateStatusUserFromForum, addUserToForum, getAllUserRequest, getAllForum, requestOnForum }
