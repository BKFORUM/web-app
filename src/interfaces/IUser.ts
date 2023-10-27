export interface IViewUserAddList {
    id: string
    fullName: string
    checked: boolean
    avatarUrl: string
    email: string
}

export interface IUserLogin {
    email: string;
    password: string;
}

export interface ICurrentUser {
    id: string
    fullName: string
    address: string
    avatarUrl: string
    createdAt: string
    dateOfBirth: string
    email: string
    gender: string
    type: string
    updatedAt: string
    phoneNumber: string
    forum: any[]
    faculty: {
        id: string
        name: string
    }
    roles: [
        {
            id: string
            name: string
        }
    ]
}