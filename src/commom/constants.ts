export const ROUTER = Object.freeze({
    LOGIN: 'auth/login',
    FORGOT_PASSWORD: 'auth/forgot-password',
    HOME: '/',
    FRIEND: '/friends',
    EVENT: '/event',
    MESSAGE: '/message',
    MESSAGE_GROUP: '/message/:id',
    PROFILE: '/profile/:id',
    FORUM: '/forums/:id'
});

export const DATA_SIDEBAR = [
    {
        id: 0,
        name: 'Feed',
        pathName: "/",
        icon: "home",
        children: [],
    },
    {
        id: 1,
        name: 'Friends',
        pathName: "/friends",
        icon: "friend",
        children: [],
    },
    {
        id: 2,
        name: 'Event',
        pathName: "/event",
        icon: "event",
        children: [],
    },
];