import {
    createStore,
    createTypedHooks,
    StateMapper,
    ActionMapper,
} from "easy-peasy";

import { authModel as auth, IAuthModel } from "./models/auth";
import { userModel as user, IUserModel } from "./models/user";
import { notifyModel as notify, INotifyModel } from "./models/notify";
import { postModel as post, IPostModel } from "./models/post";




export interface IStoreModel {
    auth: IAuthModel;
    user: IUserModel;
    notify: INotifyModel;
    post: IPostModel
}

const storeModel: IStoreModel = {
    auth,
    user,
    notify,
    post
}

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
    createTypedHooks<IStoreModel>();

interface IStateMapper extends StateMapper<IStoreModel> { }
interface IActionMapper extends ActionMapper<IStoreModel, keyof IStoreModel> { }

// Auth
export const authStateSelector = (state: IStateMapper) => state.auth;
export const authActionSelector = (state: IActionMapper) => state.auth;

// Notify
export const notifyStateSelector = (state: IStateMapper) => state.notify;
export const notifyActionSelector = (state: IActionMapper) => state.notify;

//User
export const userStateSelector = (state: IStateMapper) => state.user;
export const userActionSelector = (state: IActionMapper) => state.user;

//Post
export const postStateSelector = (state: IStateMapper) => state.post;
export const postActionSelector = (state: IActionMapper) => state.post;


const store = createStore(storeModel, {
    name: "store",
    // middleware,
});

export default store;