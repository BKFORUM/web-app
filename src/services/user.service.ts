import { IUserData } from "@interfaces/IUser";
import BaseURL from "@utils/api/baseURL";

const getCurrentUser = () => {
    return BaseURL({
        url: `/users/profile`,
        method: "GET",
    });
}

const getAllUser = (params: any) => {
    return BaseURL({
        url: `/users`,
        method: "GET",
        params,
    });
}

const getUserById = (id: string) => {
    return BaseURL({
        url: `/users/` + id,
        method: "GET",
    });
}

const getAllForumByUser = (id: string) => {
    return BaseURL({
        url: `/users/${id}/forums`,
        method: "GET",
    });
}

const editUser = (data: IUserData) => {
    return BaseURL({
        url: `/users/` + data.id,
        method: "PUT",
        data,
    });
}

const getAllFriendUser = (id: string) => {
    return BaseURL({
        url: `/users/${id}/friends`,
        method: "GET",
    });
}

export { getAllUser, getCurrentUser, getUserById, getAllForumByUser, editUser, getAllFriendUser }