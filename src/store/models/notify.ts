import { INotificationSetting, INotify } from "@interfaces/INotify";
import { persist, action, Action } from "easy-peasy";

export interface INotifyModel {
    //NotifySetting
    notifySetting: INotify;
    setNotifySetting: Action<INotifyModel, INotify>;

    notifyRealtime: INotificationSetting
    setNotifyRealtime: Action<INotifyModel, INotificationSetting>
}

export const notifyModel: INotifyModel = persist({
    //MessageError
    notifySetting: { show: false, status: "success", message: "" },
    setNotifySetting: action((state, payload) => {
        state.notifySetting = payload;
    }),

    notifyRealtime: { show: false },
    setNotifyRealtime: action((state, payload) => {
        state.notifyRealtime = payload;
    }),
})