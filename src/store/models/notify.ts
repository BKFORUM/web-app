import { INotify } from "@interfaces/INotify";
import { persist, action, Action } from "easy-peasy";

export interface INotifyModel {
    //NotifySetting
    notifySetting: INotify;
    setNotifySetting: Action<INotifyModel, INotify>;

    //DataHeader
    isDataHeader: boolean;
    setDataHeader: Action<INotifyModel, boolean>;
}

export const notifyModel: INotifyModel = persist({
    //MessageError
    notifySetting: { show: false, status: "success", message: "" },
    setNotifySetting: action((state, payload) => {
        state.notifySetting = payload;
    }),

    isDataHeader: false,
    setDataHeader: action((state, payload) => {
        state.isDataHeader = payload;
    })
})