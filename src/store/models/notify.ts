import { INotify } from "@interfaces/INotify";
import { persist, action, Action } from "easy-peasy";

export interface INotifyModel {
    //NotifySetting
    notifySetting: INotify;
    setNotifySetting: Action<INotifyModel, INotify>;
}

export const notifyModel: INotifyModel = persist({
    //MessageError
    notifySetting: { show: false, status: "success", message: "" },
    setNotifySetting: action((state, payload) => {
        state.notifySetting = payload;
    }),
})