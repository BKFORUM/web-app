import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { editUser, getAllForumByUser, getAllUser, getCurrentUser, getUserById } from "../../services/user.service";
import { ICurrentUser, IUserData } from "@interfaces/IUser";

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

    isGetCurrentUserSuccess: boolean;
    setIsGetCurrentUserSuccess: Action<IUserModel, boolean>;
    getCurrentUser: Thunk<IUserModel, undefined>;

    //GetUserById
    isGetUserByIdSuccess: boolean;
    setIsGetUserByIdSuccess: Action<IUserModel, boolean>;
    getUserById: Thunk<IUserModel, string>;

    //GetAllForumByUser
    isGetAllForumByUserSuccess: boolean;
    setIsGetAllForumByUserSuccess: Action<IUserModel, boolean>;
    isGetAllAgain: boolean,
    setIsGetAllAgain: Action<IUserModel, boolean>;
    getAllForumByUser: Thunk<IUserModel, string>;

    //editUser
    isEditUserSuccess: boolean;
    setIsEditUserSuccess: Action<IUserModel, boolean>;
    editEdit: Thunk<IUserModel, IUserData>;
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
    isGetCurrentUserSuccess: true,
    setIsGetCurrentUserSuccess: action((state, payload) => {
        state.isGetCurrentUserSuccess = payload;
    }),
    getCurrentUser: thunk(async (actions) => {
        return getCurrentUser()
            .then(async (res) => {
                actions.setIsGetCurrentUserSuccess(true)
                actions.setCurrentUserSuccess(res.data)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetCurrentUserSuccess(false)
                actions.setCurrentUserSuccess(null)
                actions.setMessageErrorUser(error?.response?.data?.message)
            });
    }),

    //getUserById
    isGetUserByIdSuccess: true,
    setIsGetUserByIdSuccess: action((state, payload) => {
        state.isGetUserByIdSuccess = payload;
    }),
    getUserById: thunk(async (actions, payload) => {
        return getUserById(payload)
            .then(async (res) => {
                actions.setIsGetAllUserSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllUserSuccess(false)
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

    //GetALLForumByUser
    isGetAllForumByUserSuccess: true,
    setIsGetAllForumByUserSuccess: action((state, payload) => {
        state.isGetAllForumByUserSuccess = payload;
    }),
    isGetAllAgain: false,
    setIsGetAllAgain: action((state, payload) => {
        state.isGetAllAgain = payload;
    }),
    getAllForumByUser: thunk(async (actions, payload) => {
        return getAllForumByUser(payload)
            .then(async (res) => {
                actions.setIsGetAllUserSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllUserSuccess(false)
                actions.setMessageErrorUser(error?.response?.data?.message)
            });
    }),

    //editUser
    isEditUserSuccess: true,
    setIsEditUserSuccess: action((state, payload) => {
        state.isEditUserSuccess = payload;
    }),
    editEdit: thunk(async (actions, payload) => {
        return editUser(payload)
            .then(async (res) => {
                actions.setIsEditUserSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditUserSuccess(false)
                actions.setMessageErrorUser(error?.response?.data?.message)
            });
    }),
})