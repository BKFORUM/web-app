import BaseURL from "@utils/api/baseURL";

const login = () => {
    return BaseURL({
        url: `/login/1`,
        method: "GET",
        // data,
    });
};


export { login }