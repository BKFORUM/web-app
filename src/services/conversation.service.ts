import { IParams } from "@interfaces/IClient";
import BaseURL from "@utils/api/baseURL";

const getAllConverSation = (params: any) => {
    return BaseURL({
        url: `/conversations`,
        method: "GET",
        params,
    });
}

const getConversationById = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/conversations/` + id,
        method: "GET",
        params,
    });
}

const addMessageToConversation = (data: any) => {
    return BaseURL({
        url: `/conversations/${data.id}/message`,
        method: "POST",
        data,
    });
}

const addConversation = (data: any) => {
    return BaseURL({
        url: `/conversations`,
        method: "POST",
        data,
    });
}

const deleteMemberOfConversation = (data: any) => {
    return BaseURL({
        url: `/conversations/${data.conversationId}/users/${data.userId}`,
        method: "DELETE",
    });
}

const addUserToConversation = (data: any) => {
    return BaseURL({
        url: `/conversations/${data.id}/users`,
        method: "POST",
        data,
    });
}

const editNickNameMember = (data: any) => {
    return BaseURL({
        url: `/conversations/${data.conversationId}/users/${data.userId}`,
        method: "PUT",
        data: { displayName: data.displayName },
    });
}



export {
    getAllConverSation,
    getConversationById,
    addMessageToConversation,
    addConversation,
    deleteMemberOfConversation,
    addUserToConversation,
    editNickNameMember,
}