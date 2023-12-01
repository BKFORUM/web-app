import { IEvent } from "@interfaces/IEvent";
import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addCommentToEvent, addEvent, deleteCommentToEvent, deleteEvent, editCommentToEvent, editEvent, getAllCommentEventById, getAllEvent, getAllUserSub, subscribeToEvent, unSubscribeToEvent } from "../../services/event.service";
import { IParams } from "@interfaces/IClient";

export interface IEventModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IEventModel, string>;

    //GetAllEvent
    isGetAllEventSuccess: boolean;
    setIsGetAllEventSuccess: Action<IEventModel, boolean>;
    getAllEvent: Thunk<IEventModel, any>;

    //AddEvent
    isAddEventSuccess: boolean;
    setIsAddEventSuccess: Action<IEventModel, boolean>;
    addEvent: Thunk<IEventModel, Omit<IEvent, 'id'>>;

    //EditEvent
    isEditEventSuccess: boolean;
    setIsEditEventSuccess: Action<IEventModel, boolean>;
    editEvent: Thunk<IEventModel, IEvent>;

    //DeleteEvent
    isDeleteEventSuccess: boolean;
    setIsDeleteEventSuccess: Action<IEventModel, boolean>;
    deleteEvent: Thunk<IEventModel, string>;

    //getAllCommentEvent
    isGetAllCommentEventSuccess: boolean;
    setIsGetAllCommentEventSuccess: Action<IEventModel, boolean>;
    getAllCommentEventById: Thunk<IEventModel, IParams>;

    //addCommentEvents
    isAddCommentEventSuccess: boolean;
    setIsAddCommentEventSuccess: Action<IEventModel, boolean>;
    addCommentEvent: Thunk<IEventModel, any>;

    //editCommentEvents
    isEditCommentEventSuccess: boolean;
    setIsEditCommentEventSuccess: Action<IEventModel, boolean>;
    editCommentEvent: Thunk<IEventModel, any>;

    //deleteCommentEvents
    isDeleteCommentEventSuccess: boolean;
    setIsDeleteCommentEventSuccess: Action<IEventModel, boolean>;
    deleteCommentEvent: Thunk<IEventModel, any>;

    //subscribeToEvent
    isSubscribedToEventSuccess: boolean;
    setIsSubscribedToEventSuccess: Action<IEventModel, boolean>
    subscribeToEvent: Thunk<IEventModel, string>;

    //unSubscribeToEvent
    isUnSubscribedToEventSuccess: boolean;
    setIsUnSubscribedToEventSuccess: Action<IEventModel, boolean>
    unSubscribeToEvent: Thunk<IEventModel, string>;

    //getAllUserSub
    isGetAllUserSubSuccess: boolean;
    setIsGetAllUserSubSuccess: Action<IEventModel, boolean>
    getAllUserSub: Thunk<IEventModel, IParams>;
}

export const eventModel: IEventModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),

    //GetAllEvent
    isGetAllEventSuccess: true,
    setIsGetAllEventSuccess: action((state, payload) => {
        state.isGetAllEventSuccess = payload;
    }),
    getAllEvent: thunk(async (actions, payload) => {
        return getAllEvent(payload)
            .then(async (res) => {
                actions.setIsGetAllEventSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddEvent
    isAddEventSuccess: true,
    setIsAddEventSuccess: action((state, payload) => {
        state.isAddEventSuccess = payload;
    }),
    addEvent: thunk(async (actions, payload) => {
        return addEvent(payload)
            .then(async (res) => {
                actions.setIsAddEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsAddEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //EditEvent
    isEditEventSuccess: true,
    setIsEditEventSuccess: action((state, payload) => {
        state.isEditEventSuccess = payload;
    }),
    editEvent: thunk(async (actions, payload) => {
        return editEvent(payload)
            .then(async (res) => {
                actions.setIsEditEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeleteEvent
    isDeleteEventSuccess: true,
    setIsDeleteEventSuccess: action((state, payload) => {
        state.isDeleteEventSuccess = payload;
    }),
    deleteEvent: thunk(async (actions, payload) => {
        return deleteEvent(payload)
            .then(async (res) => {
                actions.setIsDeleteEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeleteEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //GetAllCommentEvent
    isGetAllCommentEventSuccess: true,
    setIsGetAllCommentEventSuccess: action((state, payload) => {
        state.isGetAllCommentEventSuccess = payload;
    }),
    getAllCommentEventById: thunk(async (actions, payload) => {
        return getAllCommentEventById(payload)
            .then(async (res) => {
                actions.setIsGetAllCommentEventSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllCommentEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddCommentEvent
    isAddCommentEventSuccess: true,
    setIsAddCommentEventSuccess: action((state, payload) => {
        state.isAddCommentEventSuccess = payload;
    }),
    addCommentEvent: thunk(async (actions, payload) => {
        return addCommentToEvent(payload)
            .then(async (res) => {
                actions.setIsAddCommentEventSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsAddCommentEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //EditCommentEvent
    isEditCommentEventSuccess: true,
    setIsEditCommentEventSuccess: action((state, payload) => {
        state.isEditCommentEventSuccess = payload;
    }),
    editCommentEvent: thunk(async (actions, payload) => {
        return editCommentToEvent(payload)
            .then(async (res) => {
                actions.setIsEditCommentEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditCommentEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeleteCommentEvent
    isDeleteCommentEventSuccess: true,
    setIsDeleteCommentEventSuccess: action((state, payload) => {
        state.isDeleteCommentEventSuccess = payload;
    }),
    deleteCommentEvent: thunk(async (actions, payload) => {
        return deleteCommentToEvent(payload)
            .then(async (res) => {
                actions.setIsDeleteCommentEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeleteCommentEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //subscribedToEvent
    isSubscribedToEventSuccess: true,
    setIsSubscribedToEventSuccess: action((state, payload) => {
        state.isSubscribedToEventSuccess = payload;
    }),
    subscribeToEvent: thunk(async (actions, payload) => {
        return subscribeToEvent(payload)
            .then(async (res) => {
                actions.setIsSubscribedToEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsSubscribedToEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //unSubscribedToEvent
    isUnSubscribedToEventSuccess: true,
    setIsUnSubscribedToEventSuccess: action((state, payload) => {
        state.isUnSubscribedToEventSuccess = payload;
    }),
    unSubscribeToEvent: thunk(async (actions, payload) => {
        return unSubscribeToEvent(payload)
            .then(async (res) => {
                actions.setIsUnSubscribedToEventSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsUnSubscribedToEventSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //getAllUserSub
    isGetAllUserSubSuccess: true,
    setIsGetAllUserSubSuccess: action((state, payload) => {
        state.isGetAllUserSubSuccess = payload;
    }),
    getAllUserSub: thunk(async (actions, payload) => {
        return getAllUserSub(payload)
            .then(async (res) => {
                actions.setIsGetAllUserSubSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsGetAllUserSubSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
