import BaseURL from "@utils/api/baseURL";

const getForumById = (id: string) => {
    return BaseURL({
        url: `/forums/` + id,
        method: "GET",
    });
}

export { getForumById }
