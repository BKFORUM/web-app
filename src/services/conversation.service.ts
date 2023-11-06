import BaseURL from "@utils/api/baseURL";

const getAllConverSation = (params: any) => {
    return BaseURL({
        url: `/conversations`,
        method: "GET",
        params,
    });
}

const getConversationById = (id: string) => {
    return BaseURL({
        url: `/conversations/` + id,
        method: "GET",
    });
}

const addMessageToConversation = (data: any) => {
    return BaseURL({
        url: `/conversations/${data.id}/message`,
        method: "POST",
        data,
    });
}

export { getAllConverSation, getConversationById, addMessageToConversation }