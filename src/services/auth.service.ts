import { IUserLogin } from "@interfaces/IUser";
import BaseURL from "@utils/api/baseURL";

const login = (data: IUserLogin) => {
    return BaseURL({
        url: `/auth/login`,
        method: "POST",
        data,
    });
};

const forgotPassword = (data: { email: string }) => {
    return BaseURL({
        url: `/auth/forgot-password`,
        method: "POST",
        data,
    });
};

const resetPassword = (data: any) => {
    return BaseURL({
        url: `/auth/reset-password`,
        method: "POST",
        data,
    });
};

const changePassword = (data: any) => {
    return BaseURL({
        url: `/auth/change-password`,
        method: "POST",
        data,
    });
}

export { login, forgotPassword, resetPassword, changePassword }    