import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { getAllNotification, updateNotification } from "../../services/notification.service";
import { INotification } from "@interfaces/INotify";

export interface INotificationModel {
    //MessageError
    messageError: string;
    setMessageError: Action<INotificationModel, string>;

    //GetAllNotification
    isGetAllNotificationSuccess: boolean;
    setIsGetAllNotificationSuccess: Action<INotificationModel, boolean>;
    getAllNotification: Thunk<INotificationModel, any>;

    //updateNotification
    updateNotification: Thunk<INotificationModel, string>;

    //DataNotification
    listNotification: INotification[];
    setListNotification: Action<INotificationModel, INotification[]>;
    totalRowCount: number;
    setTotalRowCount: Action<INotificationModel, number>;

}

export const notificationModel: INotificationModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),

    listNotification: [],
    setListNotification: action((state, payload) => {
        state.listNotification = payload;
    }),
    totalRowCount: 0,
    setTotalRowCount: action((state, payload) => {
        state.totalRowCount = payload;
    }),

    //GetAllNotification
    isGetAllNotificationSuccess: true,
    setIsGetAllNotificationSuccess: action((state, payload) => {
        state.isGetAllNotificationSuccess = payload;
    }),
    getAllNotification: thunk(async (actions, payload) => {
        return getAllNotification(payload)
            .then(async (res) => {
                actions.setIsGetAllNotificationSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllNotificationSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //updateNotification
    updateNotification: thunk(async (actions, payload) => {
        return updateNotification(payload)
            .then(async (res) => {
                return res;
            })
            .catch((error) => {
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
