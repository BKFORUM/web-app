import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { getAllRequestFriend, getFriendMe, requestFriend, updateStatusFriend } from "../../services/friend.service";
import { IUserData } from "@interfaces/IUser";

export interface IFriendModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IFriendModel, string>;

    //RequestFriend
    isRequestFriendSuccess: boolean;
    setIsRequestFriendSuccess: Action<IFriendModel, boolean>;
    requestFriend: Thunk<IFriendModel, string>;

    //GetAllRequestFriend
    isGetAllRequestFriendSuccess: boolean;
    setIsGetAllRequestFriendSuccess: Action<IFriendModel, boolean>;
    getAllRequestFriend: Thunk<IFriendModel, undefined>;

    //GetFriendMe
    listFriendMe: IUserData[];
    setListFriendMe: Action<IFriendModel, IUserData[]>;
    addFriendAtList: Action<IFriendModel, IUserData>;
    isGetFriendMeFriendSuccess: boolean;
    setIsGetFriendMeFriendSuccess: Action<IFriendModel, boolean>;
    getFriendMe: Thunk<IFriendModel, undefined>;

    //UpdateStatusFriend
    isUpdateStatusFriendSuccess: boolean;
    setIsUpdateStatusFriendSuccess: Action<IFriendModel, boolean>;
    updateStatusFriend: Thunk<IFriendModel, any>;
}

export const friendModel: IFriendModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),

    //RequestFriend
    isRequestFriendSuccess: true,
    setIsRequestFriendSuccess: action((state, payload) => {
        state.isRequestFriendSuccess = payload;
    }),
    requestFriend: thunk(async (actions, payload) => {
        return requestFriend(payload)
            .then(async (res) => {
                actions.setIsRequestFriendSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsRequestFriendSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //GetAllRequestFriend
    isGetAllRequestFriendSuccess: true,
    setIsGetAllRequestFriendSuccess: action((state, payload) => {
        state.isGetAllRequestFriendSuccess = payload;
    }),
    getAllRequestFriend: thunk(async (actions) => {
        return getAllRequestFriend()
            .then(async (res) => {
                actions.setIsGetAllRequestFriendSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllRequestFriendSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //GetFriendMe
    listFriendMe: [],
    setListFriendMe: action((state, payload) => {
        state.listFriendMe = payload;
    }),
    isGetFriendMeFriendSuccess: true,
    setIsGetFriendMeFriendSuccess: action((state, payload) => {
        state.isGetFriendMeFriendSuccess = payload;
    }),
    addFriendAtList: action((state, payload) => {
        state.listFriendMe.push(payload);
    }),
    getFriendMe: thunk(async (actions) => {
        return getFriendMe()
            .then(async (res) => {
                actions.setListFriendMe(res.data)
                actions.setIsGetFriendMeFriendSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setListFriendMe([])
                actions.setIsGetFriendMeFriendSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),


    //UpdateStatusFriend
    isUpdateStatusFriendSuccess: true,
    setIsUpdateStatusFriendSuccess: action((state, payload) => {
        state.isUpdateStatusFriendSuccess = payload;
    }),
    updateStatusFriend: thunk(async (actions, payload) => {
        return updateStatusFriend(payload)
            .then(async (res) => {
                actions.setIsUpdateStatusFriendSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsUpdateStatusFriendSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
