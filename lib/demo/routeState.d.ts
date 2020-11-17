export declare type Route = {
    type: 'login';
} | {
    type: 'profile';
    profileId: string;
};
export declare class RouteState {
    route: Route;
    setRoute(route: Route): void;
    loggedIn: boolean;
    login(): void;
    logout(): void;
    loginRequiredMessage: string;
    setLoginRequiredMessage(message: string): void;
}
export declare const routeState: RouteState;
