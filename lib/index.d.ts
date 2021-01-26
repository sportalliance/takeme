import { match, MatchResult, MatchResultParams } from './match';
export { match, MatchResult, MatchResultParams };
export interface Html5RoutingOptions {
    baseUrl?: string;
    appendQueryParams?: boolean;
}
export interface RouteChangeEvent {
    oldPath: string;
    newPath: string;
}
export interface RouteEnterEvent extends RouteChangeEvent {
    params: MatchResultParams;
}
/**
 * We support sync and async operations in the same API
 */
export declare type SyncOrAsyncResult<T> = T | Promise<T>;
export declare type RouteBeforeEnterResult = SyncOrAsyncResult<void | null | undefined | {
    redirect: string;
    replace?: boolean;
}>;
export declare type RouteEnterResult = void;
export declare type RouteBeforeLeaveResult = SyncOrAsyncResult<void | null | undefined | boolean | {
    redirect: string;
    replace?: boolean;
}>;
export interface RouteConfig {
    /**
     * The pattern to match against
     */
    $: string;
    /**
     * Called before entering a route. This is your chance to redirect if you want.
     **/
    beforeEnter?: (evt: RouteEnterEvent) => RouteBeforeEnterResult;
    /**
     * Called on entering a route.
     **/
    enter?: (evt: RouteEnterEvent) => RouteEnterResult;
    /**
     * On route leave,
     * you can redirect to elsewhere if you want or just return false to prevent leaving
     **/
    beforeLeave?: (evt: RouteChangeEvent) => RouteBeforeLeaveResult;
}
export declare class Router {
    routes: RouteConfig[];
    constructor(routes: RouteConfig[]);
    /**
     * Runs through the config and triggers an routes that matches the current path
     */
    init(): Promise<void>;
    destroy(): void;
    /**
     * Enables pure html5 routing.
     * NOTE:
     * - Server must support returning the same page on route triggers.
     * - Your browser targets support pushState: https://caniuse.com/#search=pushstate
     */
    enableHtml5Routing(baseUrlOrOptions?: string | Html5RoutingOptions): this;
    private trigger;
}
/**
 * Navigates to the given path
 */
export declare function navigate(path: string, replace?: boolean): void;
/**
 * Gives you a link that when triggered, navigates to the given path
 */
export declare function link(path: string): string;
/**
 * Suppresses browser default `click` behaviour on link
 */
export declare const html5LinkOnClick: ({event, replace}: {
    event: MouseEvent;
    replace?: boolean | undefined;
}) => void;
