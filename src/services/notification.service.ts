import BaseURL from "@utils/api/baseURL";

const getAllNotification = (params: any) => {
    return BaseURL({
        url: `/notifications`,
        method: "GET",
        params,
    });
};

const updateNotification = (id: string) => {
    return BaseURL({
        url: `/notifications/` + id,
        method: "PATCH",
    });
}

const readAllNotification = () => {
    return BaseURL({
        url: `/notifications/all`,
        method: "PATCH",
    });
}

export { getAllNotification, updateNotification, readAllNotification }