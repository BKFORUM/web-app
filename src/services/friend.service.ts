import BaseURL from "@utils/api/baseURL";

const requestFriend = (id: string) => {
    return BaseURL({
        url: `/friends`,
        method: "POST",
        data: { id: id },
    });
};

const getAllRequestFriend = () => {
    return BaseURL({
        url: `/friends`,
        method: "GET",
    });
};

const updateStatusFriend = (data: any) => {
    return BaseURL({
        url: `/friends/` + data?.id,
        method: "PATCH",
        data,
    });
}

const getFriendMe = () => {
    return BaseURL({
        url: `/friends/me`,
        method: "GET",
    });
}

export { requestFriend, getAllRequestFriend, updateStatusFriend, getFriendMe }   