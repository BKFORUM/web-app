// import IsTokenValid from "@utils/functions/isValidToken";
import axios from "axios";

const BaseURL = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

BaseURL.interceptors.request.use(
    async (config) => {
        let user: any
        try {
            user = localStorage.getItem("user");
        } catch (e) { }

        // if (!IsTokenValid()) {
        //     console.log('token het han')
        // }

        if (user?.access_token !== null) {
            config.headers.Authorization = `Bearer ${user?.access_token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

// after send request
BaseURL.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/login" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const user: any = localStorage.getItem("user");
                    const res = await BaseURL.post("/auth/refreshtoken", {
                        refresh_token: user.refresh_token,
                    });

                    const { access_token } = res.data;
                    localStorage.setItem('user', JSON.stringify({ ...user, access_token: access_token }))

                    return BaseURL(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

export default BaseURL;
