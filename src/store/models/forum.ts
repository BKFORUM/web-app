import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addForum, addUserToForum, updateStatusUserFromForum, editForum, getAllTopic, getAllUserRequest, getForumById, getAllForum, requestOnForum, exitForum } from "../../services/forum.service";
import { IFormDataForum } from "@interfaces/IForum";
import { IListUserRequest, IUserData } from "@interfaces/IUser";

export interface IForumModel {
    //MessageError
    messageErrorForum: string;
    setMessageErrorForum: Action<IForumModel, string>;

    // GetALLForum
    isGetAllForumSuccess: boolean;
    setIsGetAllForumSuccess: Action<IForumModel, boolean>
    getAllForum: Thunk<IForumModel, any>;

    //GetForumById
    isGetAllAgainForumById: boolean;
    setIsGetAllAgainForumById: Action<IForumModel, boolean>
    isGetForumByIdSuccess: boolean;
    listUserForum: IUserData[]
    setListUserForum: Action<IForumModel, IUserData[]>
    setIsGetForumByIdSuccess: Action<IForumModel, boolean>
    getForumById: Thunk<IForumModel, any>;

    // //AddForum
    isAddForumSuccess: boolean;
    setIsAddForumSuccess: Action<IForumModel, boolean>
    addForum: Thunk<IForumModel, IFormDataForum>;

    //EditForum
    isEditForumSuccess: boolean;
    setIsEditForumSuccess: Action<IForumModel, boolean>
    editForum: Thunk<IForumModel, IFormDataForum>;

    //DeleteUserFromForum
    isDeleteUserFromForumSuccess: boolean;
    setIsDeleteUserFromForumSuccess: Action<IForumModel, boolean>
    updateStatusUserFromForum: Thunk<IForumModel, any>;

    // AddUserToForum
    isAddUserToForumSuccess: boolean;
    setIsAddUserToForumSuccess: Action<IForumModel, boolean>
    addUserToForum: Thunk<IForumModel, IListUserRequest>;

    //updateStatusForum
    // isUpdateStatusForumSuccess: boolean;
    // setIsUpdateStatusForum: Action<IForumModel, boolean>
    // updateStatusForum: Thunk<IForumModel, IRequestForumData>;

    //GetALLTopic
    isGetAllTopicSuccess: boolean
    setIsGetAllTopicSuccess: Action<IForumModel, boolean>
    getAllTopic: Thunk<IForumModel, undefined>;

    //GetAllUserRequest
    isGetAllUserRequestSuccess: boolean
    setIsGetAllUserRequestSuccess: Action<IForumModel, boolean>
    getAllUserRequest: Thunk<IForumModel, string>;

    //RequestOnForum
    isRequestOnForumSuccess: boolean
    setIsRequestOnForumSuccess: Action<IForumModel, boolean>
    requestOnForum: Thunk<IForumModel, string>;

    //ExitForum
    isExitForumSuccess: boolean
    setIsExitForumSuccess: Action<IForumModel, boolean>
    exitForum: Thunk<IForumModel, string>;

}

export const forumModel: IForumModel = persist({
    //MessageError
    messageErrorForum: "",
    setMessageErrorForum: action((state, payload) => {
        state.messageErrorForum = payload;
    }),

    //GetAllForum
    isGetAllForumSuccess: true,
    setIsGetAllForumSuccess: action((state, payload) => {
        state.isGetAllForumSuccess = payload;
    }),
    getAllForum: thunk(async (actions, payload) => {
        return getAllForum(payload)
            .then(async (res) => {
                actions.setIsGetAllForumSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //GetForumById
    isGetAllAgainForumById: false,
    setIsGetAllAgainForumById: action((state, payload) => {
        state.isGetAllAgainForumById = payload;
    }),
    isGetForumByIdSuccess: true,
    setIsGetForumByIdSuccess: action((state, payload) => {
        state.isGetForumByIdSuccess = payload;
    }),
    listUserForum: [],
    setListUserForum: action((state, payload) => {
        state.listUserForum = payload;
    }),
    getForumById: thunk(async (actions, payload) => {
        return getForumById(payload)
            .then(async (res) => {
                actions.setIsGetForumByIdSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetForumByIdSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //AddForum
    isAddForumSuccess: true,
    setIsAddForumSuccess: action((state, payload) => {
        state.isAddForumSuccess = payload;
    }),
    addForum: thunk(async (actions, payload) => {
        return addForum(payload)
            .then(async (res) => {
                actions.setIsAddForumSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsAddForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //EditForum
    isEditForumSuccess: true,
    setIsEditForumSuccess: action((state, payload) => {
        state.isEditForumSuccess = payload;
    }),

    editForum: thunk(async (actions, payload) => {
        return editForum(payload)
            .then(async (res) => {
                actions.setIsEditForumSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //DeleteUserFromForum
    isDeleteUserFromForumSuccess: true,
    setIsDeleteUserFromForumSuccess: action((state, payload) => {
        state.isDeleteUserFromForumSuccess = payload;
    }),

    updateStatusUserFromForum: thunk(async (actions, payload) => {
        return updateStatusUserFromForum(payload)
            .then(async (res) => {
                actions.setIsDeleteUserFromForumSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeleteUserFromForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    // isUpdateStatusForumSuccess: true,
    // setIsUpdateStatusForum: action((state, payload) => {
    //     state.isUpdateStatusForumSuccess = payload;
    // }),

    // updateStatusForum: thunk(async (actions, payload) => {
    //     return updateStatusForum(payload)
    //         .then(async (res) => {
    //             actions.setIsUpdateStatusForum(true)
    //             return res;
    //         })
    //         .catch((error) => {
    //             actions.setIsUpdateStatusForum(false)
    //             actions.setMessageErrorForum(error?.response?.data?.message)
    //         });
    // }),

    // //DeleteForum
    // isDeleteForumSuccess: true,
    // setIsDeleteForumSuccess: action((state, payload) => {
    //     state.isDeleteForumSuccess = payload;
    // }),

    // deleteForum: thunk(async (actions, payload) => {
    //     return deleteForum(payload)
    //         .then(async (res) => {
    //             actions.setIsEditForumSuccess(true)
    //             return res;
    //         })
    //         .catch((error) => {
    //             actions.setIsEditForumSuccess(false)
    //             actions.setMessageErrorForum(error?.response?.data?.message)
    //         });
    // }),

    //AddUserToForum
    isAddUserToForumSuccess: true,
    setIsAddUserToForumSuccess: action((state, payload) => {
        state.isAddUserToForumSuccess = payload;
    }),
    addUserToForum: thunk(async (actions, payload) => {
        return addUserToForum(payload)
            .then(async (res) => {
                actions.setIsAddUserToForumSuccess(true)
                return res
            })
            .catch((error) => {
                actions.setIsAddUserToForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //GetALLTopic
    isGetAllTopicSuccess: true,
    setIsGetAllTopicSuccess: action((state, payload) => {
        state.isGetAllTopicSuccess = payload;
    }),
    getAllTopic: thunk(async (actions) => {
        return getAllTopic()
            .then(async (res) => {
                actions.setIsGetAllTopicSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllTopicSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //GetAllUserRequest
    isGetAllUserRequestSuccess: true,
    setIsGetAllUserRequestSuccess: action((state, payload) => {
        state.isGetAllUserRequestSuccess = payload;
    }),
    getAllUserRequest: thunk(async (actions, payload) => {
        return getAllUserRequest(payload)
            .then(async (res) => {
                actions.setIsGetAllUserRequestSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllUserRequestSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //RequestOnForum
    isRequestOnForumSuccess: true,
    setIsRequestOnForumSuccess: action((state, payload) => {
        state.isRequestOnForumSuccess = payload;
    }),
    requestOnForum: thunk(async (actions, payload) => {
        return requestOnForum(payload)
            .then(async (res) => {
                actions.setIsRequestOnForumSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsRequestOnForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),

    //ExitForum
    isExitForumSuccess: true,
    setIsExitForumSuccess: action((state, payload) => {
        state.isExitForumSuccess = payload;
    }),
    exitForum: thunk(async (actions, payload) => {
        return exitForum(payload)
            .then(async (res) => {
                actions.setIsExitForumSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsExitForumSuccess(false)
                actions.setMessageErrorForum(error?.response?.data?.message)
            });
    }),
})