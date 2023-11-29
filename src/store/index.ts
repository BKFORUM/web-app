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
import { conversationModel as conversation, IConversationModel } from "./models/conversation";
import { notificationModel as notification, INotificationModel } from "./models/notification";
import { searchModel as search, ISearchModel } from "./models/search";
import { eventModel as event, IEventModel } from "./models/event";

export interface IStoreModel {
    auth: IAuthModel;
    user: IUserModel;
    notify: INotifyModel;
    post: IPostModel
    forum: IForumModel;
    friend: IFriendModel;
    conversation: IConversationModel;
    notification: INotificationModel;
    search: ISearchModel;
    event: IEventModel

}

const storeModel: IStoreModel = {
    auth,
    user,
    notify,
    post,
    forum,
    friend,
    conversation,
    notification,
    search,
    event,
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

//Conversation
export const conversationStateSelector = (state: IStateMapper) => state.conversation;
export const conversationActionSelector = (state: IActionMapper) => state.conversation;

//Notification
export const notificationStateSelector = (state: IStateMapper) => state.notification;
export const notificationActionSelector = (state: IActionMapper) => state.notification;

//Search
export const searchStateSelector = (state: IStateMapper) => state.search;
export const searchActionSelector = (state: IActionMapper) => state.search;

//Event
export const eventStateSelector = (state: IStateMapper) => state.event;
export const eventActionSelector = (state: IActionMapper) => state.event;


const store = createStore(storeModel, {
    name: "store",
    // middleware,
});

export default store;