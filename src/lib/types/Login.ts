export type Login = {
    identity: string;
    password: string;
}

export type LoginResponse = {
    data: {
        access_token: string;
        refresh_token: string
    },
    message: string
}