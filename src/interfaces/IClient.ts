export interface IClient {
    id: number;
    name: string
}

export interface IParams {
    id?: string;
    params?: any
}

export interface pageMode {
    page: number,
    pageSize: number
}
