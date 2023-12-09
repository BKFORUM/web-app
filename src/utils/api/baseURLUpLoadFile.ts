import axios from "axios";

const BaseURLUpLoadFile = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

BaseURLUpLoadFile.interceptors.request.use(
    async (config) => {
        const auth: any = JSON.parse(String(localStorage.getItem("auth")));
        if (auth?.access_token !== null) {
            config.headers.Authorization = `Bearer ${auth?.accessToken}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

// BaseURLUpLoadFile.interceptors.request.use(request => {
//     console.log('Starting Request', JSON.stringify(request, null, 2))
//     return request
// })

// after send request
BaseURLUpLoadFile.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "/auth/login" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                const auth: any = JSON.parse(String(localStorage.getItem("auth")));
                console.log(auth);
                if (auth !== undefined) {
                    const resp = await refreshToken();
                    if (resp) {
                        localStorage.setItem('auth', JSON.stringify(resp.data))
                        const access_token = resp.data.accessToken;
                        BaseURLUpLoadFile.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${access_token}`;
                        return BaseURLUpLoadFile(originalConfig);
                    }
                }
                else {
                    originalConfig._retry = false;
                }
            }
        }
        return Promise.reject(err);
    }
);

const refreshToken = async () => {
    const auth: any = JSON.parse(String(localStorage.getItem("auth")));
    try {
        const resp = await BaseURLUpLoadFile.get("/auth/refresh", {
            headers: {
                Authorization: `Bearer ${auth?.refreshToken}`
            }
        })
        localStorage.setItem('auth', JSON.stringify(resp.data))
        return resp;
    } catch (e) {
        // console.log("Error", e);
        localStorage.removeItem('auth')
    }

};


export default BaseURLUpLoadFile;
