import { IUserLogin } from "@interfaces/IUser";
import BaseURL from "@utils/api/baseURL";

const login = (data: IUserLogin) => {
    return BaseURL({
        url: `/auth/login`,
        method: "POST",
        data,
    });
};

export { login }    