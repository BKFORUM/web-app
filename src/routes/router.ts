import { ROUTER } from "@commom/constants";
import DefaultLayout from "@layouts/DefaultLayout";
import MessageLayout from "@layouts/MessageLayout";
import ProfileLayout from "@layouts/ProfileLayout";
import Event from "@pages/Event";
import Forum from "@pages/Forum";
import Friend from "@pages/Friend";
import HomePage from "@pages/HomePage";
import Message from "@pages/Message";
import Profile from "@pages/Profile";
import Search from "@pages/Search";



export const routerUser = [
    { path: ROUTER.HOME, element: HomePage, layout: DefaultLayout },
    { path: ROUTER.FRIEND, element: Friend, layout: DefaultLayout },
    { path: ROUTER.EVENT, element: Event, layout: DefaultLayout },
    { path: ROUTER.PROFILE, element: Profile, layout: ProfileLayout },
    { path: ROUTER.MESSAGE, element: Message, layout: MessageLayout, },
    { path: ROUTER.MESSAGE_GROUP, element: Message, layout: MessageLayout },
    { path: ROUTER.FORUM, element: Forum, layout: DefaultLayout },
    { path: ROUTER.SEARCH, element: Search, layout: DefaultLayout },
];

