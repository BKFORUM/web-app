import axios from "axios";
import jwt_decode from 'jwt-decode'

const BaseURLUpLoadFile = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

BaseURLUpLoadFile.interceptors.request.use(
    async (config) => {
        const user: any = JSON.parse(String(localStorage.getItem("user")));
        if (user?.access_token !== null) {
            config.headers.Authorization = `Bearer ${user?.access_token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

BaseURLUpLoadFile.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

// after send request
BaseURLUpLoadFile.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "/auth/login" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                const user: any = JSON.parse(String(localStorage.getItem("user")));
                try {
                    const res = await axios.get('http://52.139.152.154/auth/refresh', {
                        headers: {
                            Authorization: `Bearer ${user?.refresh_token}`
                        }
                    })
                    if (res) {
                        var decoded: any = jwt_decode(res?.data?.accessToken)
                        const user = {
                            name: decoded?.name,
                            exp: decoded?.exp,
                            role: decoded?.roles[0],
                            access_token: res?.data?.accessToken,
                            refresh_token: res?.data?.refreshToken,
                        }
                        localStorage.setItem('user', JSON.stringify(user))
                    }
                } catch (error: any) {
                    console.log('error', error?.response?.data?.message)
                }
            }
        }
        return Promise.reject(err);
    }
);

export default BaseURLUpLoadFile;
