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
import { forumModel as forum, IForumModel } from "./models/forum";
import { friendModel as friend, IFriendModel } from "./models/friend";

export interface IStoreModel {
    auth: IAuthModel;
    user: IUserModel;
    notify: INotifyModel;
    post: IPostModel
    forum: IForumModel;
    friend: IFriendModel;
}

const storeModel: IStoreModel = {
    auth,
    user,
    notify,
    post,
    forum,
    friend
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

//Forum
export const forumStateSelector = (state: IStateMapper) => state.forum;
export const forumActionSelector = (state: IActionMapper) => state.forum;

//Post
export const postStateSelector = (state: IStateMapper) => state.post;
export const postActionSelector = (state: IActionMapper) => state.post;

//Friend
export const friendStateSelector = (state: IStateMapper) => state.friend;
export const friendActionSelector = (state: IActionMapper) => state.friend;


const store = createStore(storeModel, {
    name: "store",
    // middleware,
});

export default store;