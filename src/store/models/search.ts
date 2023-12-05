import { persist, action, Action } from "easy-peasy";

export interface ISearchModel {
    //TextSearch
    textSearch: string;
    setTextSearch: Action<ISearchModel, string>;

}

export const searchModel: ISearchModel = persist({
    //TextSearch
    textSearch: "",
    setTextSearch: action((state, payload) => {
        state.textSearch = payload;
    }),

})