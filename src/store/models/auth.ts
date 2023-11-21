import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { forgotPassword, login, resetPassword } from "../../services/auth.service";
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

    //Logout
    isLogoutSuccess: boolean;
    setIsLogoutSuccess: Action<IAuthModel, boolean>;

    //ForgotPassword
    isForgotPasswordSuccess: boolean;
    setIsForgotPasswordSuccess: Action<IAuthModel, boolean>;
    forgotPassword: Thunk<IAuthModel, { email: string }>;

    //ResetPassword
    isResetPasswordSuccess: boolean;
    setIsResetPasswordSuccess: Action<IAuthModel, boolean>;
    resetPassword: Thunk<IAuthModel, any>;
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

    //Logout
    isLogoutSuccess: false,
    setIsLogoutSuccess: action((state, payload) => {
        state.isLogoutSuccess = payload;
    }),

    //ForgotPassword
    isForgotPasswordSuccess: true,
    setIsForgotPasswordSuccess: action((state, payload) => {
        state.isForgotPasswordSuccess = payload;
    }),
    forgotPassword: thunk(async (actions, payload) => {
        return forgotPassword(payload)
            .then(async (res) => {
                actions.setIsForgotPasswordSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsForgotPasswordSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //ResetPassword
    isResetPasswordSuccess: true,
    setIsResetPasswordSuccess: action((state, payload) => {
        state.isResetPasswordSuccess = payload;
    }),
    resetPassword: thunk(async (actions, payload) => {
        return resetPassword(payload)
            .then(async (res) => {
                actions.setIsResetPasswordSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsResetPasswordSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
