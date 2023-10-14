import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { login } from "../../services/auth.service";
import { setUserLocalStorage } from "@utils/functions/localStorage";

export interface IAuthModel {
    //Login
    // isLoginSuccess: boolean;
    // setIsLoginSuccess: Action<IAuthModel, boolean>;
    login: Thunk<IAuthModel, undefined>;
}

export const authModel: IAuthModel = persist({
    //Login
    // isLoginSuccess: false,
    // setIsLoginSuccess: action((state, payload) => {
    //     state.isLoginSuccess = payload;
    // }),
    login: thunk(async (actions, payload) => {
        return login()
            .then(async (res) => {
                if (!res.data.success) {
                    // actions.setIsLoginSuccess(false);
                    return false;
                }
                // setUserLocalStorage(res.data.data)
                // actions.setIsLoginSuccess(false);
                // const { access_token, refresh_token, ...user } = res.data?.data;
                // console.log(res)
                localStorage.setItem('user', JSON.stringify({ ...res.data.data, created_at: Date.now().toString() }));
                return res.data;
            })
            .catch((error) => {
                // actions.setIsLoginSuccess(false);
                console.log(error)
            });
    }),
})
