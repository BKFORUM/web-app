import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { getAllUser, getCurrentUser } from "../../services/user.service";
import { ICurrentUser } from "@interfaces/IUser";

export interface IUserModel {
    //MessageError
    messageErrorUser: string;
    setMessageErrorUser: Action<IUserModel, string>;

    //GetALLUser
    isGetAllUserSuccess: boolean;
    setIsGetAllUserSuccess: Action<IUserModel, boolean>;
    getAllUser: Thunk<IUserModel, any>;

    //GetCurrentUser
    currentUserSuccess: null | ICurrentUser;
    setCurrentUserSuccess: Action<IUserModel, ICurrentUser | null>;
    getCurrentUser: Thunk<IUserModel, undefined>;
}

export const userModel: IUserModel = persist({
    //MessageError
    messageErrorUser: "",
    setMessageErrorUser: action((state, payload) => {
        state.messageErrorUser = payload;
    }),

    //GetCurrentUser
    currentUserSuccess: null,
    setCurrentUserSuccess: action((state, payload) => {
        state.currentUserSuccess = payload;
    }),
    getCurrentUser: thunk(async (actions) => {
        return getCurrentUser()
            .then(async (res) => {
                actions.setCurrentUserSuccess(res.data)
                return res.data;
            })
            .catch((error) => {
                actions.setCurrentUserSuccess(null)
                actions.setMessageErrorUser(error?.response?.data?.message)
            });
    }),

    //GetALLUser
    isGetAllUserSuccess: true,
    setIsGetAllUserSuccess: action((state, payload) => {
        state.isGetAllUserSuccess = payload;
    }),
    getAllUser: thunk(async (actions, payload) => {
        return getAllUser(payload)
            .then(async (res) => {
                actions.setIsGetAllUserSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllUserSuccess(false)
                actions.setMessageErrorUser(error?.response?.data?.message)
            });
    }),
})