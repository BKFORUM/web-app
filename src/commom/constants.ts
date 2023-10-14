export const ROUTER = Object.freeze({
    LOGIN: '/login',
    HOME: '/',
    FRIEND: '/friends',
    EVENT: '/event',
    MESSAGE: '/message',
    MESSAGE_GROUP: '/message/:id',
    PROFILE: '/profile/:slug'
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
    //   {
    //     id: 2,
    //     name: i18n.t("sidebar.contact_management"),
    //     pathName: "/contact/facility",
    //     icon: "contact",
    //     children: [
    //       {
    //         id: 3,
    //         name: i18n.t("sidebar.facility_contact_management"),
    //         pathName: "/contact/facility",
    //         children: [],
    //       },
    //       {
    //         id: 4,
    //         name: i18n.t("sidebar.service_contact_management"),
    //         pathName: "/contact/service",
    //         children: [],
    //       },
    //       {
    //         id: 20,
    //         name: i18n.t("sidebar.user_contact_management"),
    //         pathName: "/contact/user",
    //         children: [],
    //       },
    //     ],
    //   },
];