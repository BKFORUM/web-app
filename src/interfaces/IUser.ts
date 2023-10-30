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

export interface IUserData {
    id: string
    fullName: string
    gender: string
    dateOfBirth: string
    avatarUrl: string
    type: string
    faculty?: {
        id: string
        name: string
    }
    facultyId: string
    phoneNumber: string
    email: string

}