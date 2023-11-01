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
        const auth: any = JSON.parse(String(localStorage.getItem("auth")));
        if (auth?.accessToken !== null) {
            config.headers.Authorization = `Bearer ${auth?.accessToken}`;
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
                const auth: any = JSON.parse(String(localStorage.getItem("auth")));
                try {
                    const res = await axios.get('http://52.139.152.154/api/v1/auth/refresh', {
                        headers: {
                            Authorization: `Bearer ${auth?.refreshToken}`
                        }
                    })
                    if (res) {
                        localStorage.setItem('auth', JSON.stringify(res.data))
                    }
                } catch (error: any) {
                    console.log('error', error?.response?.data?.message)
                }
            }
        }
        return Promise.reject(err);
    }
);

export default BaseURL;
