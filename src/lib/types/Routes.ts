export type Route = {
    method: string;
    path: string;
}

export type Routes = Array<Route>

export type RoutesResponse = {
    data: Routes,
    message: string
}