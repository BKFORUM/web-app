import { ROUTER } from "@commom/constants";
import Event from "@pages/Event";
import Friend from "@pages/Friend";
import HomePage from "@pages/HomePage";
import Message from "@pages/Message";
import Profile from "@pages/Profile";



export const routerUser = [
    { path: ROUTER.HOME, element: HomePage, index: true },
    { path: ROUTER.FRIEND, element: Friend },
    { path: ROUTER.EVENT, element: Event },
    { path: ROUTER.PROFILE, element: Profile },
    { path: ROUTER.MESSAGE, element: Message },
    // { path: ROUTER.EVENT_MANAGEMENT, element: EventManagement },
];

