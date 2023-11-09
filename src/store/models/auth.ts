import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { login } from "../../services/auth.service";
import { IUserLogin } from "@interfaces/IUser";

export interface IAuthModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IAuthModel, string>;

    //isAccessToken
    accessToken: string;
    setAccessToken: Action<IAuthModel, string>

    //Login
    isLoginSuccess: boolean;
    setIsLoginSuccess: Action<IAuthModel, boolean>;
    login: Thunk<IAuthModel, IUserLogin>;
}

export const authModel: IAuthModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),
    //accessToken
    accessToken: '',
    setAccessToken: action((state, payload) => {
        state.accessToken = payload;
    }),

    //Login
    isLoginSuccess: true,
    setIsLoginSuccess: action((state, payload) => {
        state.isLoginSuccess = payload;
    }),
    login: thunk(async (actions, payload) => {
        return login(payload)
            .then(async (res) => {
                actions.setAccessToken(res.data?.accessToken)
                localStorage.setItem('auth', JSON.stringify(res.data))
                actions.setIsLoginSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsLoginSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
