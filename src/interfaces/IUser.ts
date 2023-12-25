

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
    forums: {
        id: string
        avatarUrl: string
        modId: string
        name: string
        type: string
    }[]
    friendStatus: string
}

export interface IUserData {
    id?: string
    displayName?: string
    fullName: string
    gender: string
    dateOfBirth: string
    avatarUrl?: string
    type: string
    faculty?: {
        id: string
        name: string
    }
    facultyId?: string
    facultyName?: string
    phoneNumber: string
    email: string
    address?: string
    friendStatus?: string
    checked?: boolean
}

export interface IListUserRequest {
    id: string
    userIds: string[]
}

export interface IUserRequestForum {
    user: IUserData
    userType: string

}