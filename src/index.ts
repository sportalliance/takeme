import { match, MatchResult, MatchResultParams } from './match';
export { match, MatchResult, MatchResultParams };

export interface Html5RoutingOptions {
  baseUrl?: string;
  appendQueryParams?: boolean;
}

namespace dom {
  /** Serverside safe document.location */
  export const dloc = typeof document !== 'undefined' ? document.location : { hash: '', pathname: '', search: '' };

  export let html5Base: null | string = null;
  export let html5RoutingOptions: Html5RoutingOptions | undefined = {};
  export function html5ModeEnabled() {
    return html5Base !== null;
  }

  export function readLocation(): string {
    if (html5Base == null) {
      const hash =
        // When url shows '#'
        // - Non-IE browsers return ''
        // - IE returns '#'
        (dloc.hash === '' || dloc.hash === '#')
          ? '/'
          /** 
           * Remove the leading # 
           * This keeps the matching algorithm independent of `#` (client side routing) and `/` (server side routing)
           **/
          : dloc.hash.substring(1);

      return hash;
    }
    else {
      return dloc.pathname.substr(html5Base.length);
    }
  }

  /**
   * Used to track the last value set.
   * if it does not change we ignore events
   */
  export let oldLocation = readLocation();

  export function setLocation(location: string, replace: boolean) {
    if (readLocation() === location) return;

    if (typeof history !== 'undefined' && history && history.pushState) {
      if (replace) {
        history.replaceState({}, document.title, location)
      }
      else {
        history.pushState({}, document.title, location)
      }
      /**
       * Just calling history.pushState() or history.replaceState() won't trigger a popstate event
       */
      fire();
    } else {
      dloc.hash = location;
    }

    oldLocation = readLocation();
  }

  /** Current listeners */
  export type ChangeEvent = { oldLocation: string, newLocation: string }
  type Listener = { (evt: ChangeEvent): void }
  let listeners: Listener[] = [];
  const fire = () => {
    const newLocation = readLocation();
    if (oldLocation === newLocation) return;
    listeners.forEach(l => l({ oldLocation, newLocation }));
    oldLocation = newLocation;
  };

  if (typeof window !== 'undefined' && window) {
    window.addEventListener('hashchange', fire, false);
    window.addEventListener('popstate', fire);
  }

  export function listen(cb: (evt: ChangeEvent) => void) {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter(l => l !== cb);
    }
  }

  export function unlisten() {
    listeners = [];
  }
}

export interface RouteChangeEvent {
  oldPath: string,
  newPath: string,
}
export interface RouteEnterEvent extends RouteChangeEvent {
  params: MatchResultParams
}

/** 
 * We support sync and async operations in the same API
 */
export type SyncOrAsyncResult<T> = T | Promise<T>;

export type RouteBeforeEnterResult = SyncOrAsyncResult<
  void | null | undefined
  | { redirect: string, replace?: boolean }>;

export type RouteEnterResult = void;

export type RouteBeforeLeaveResult = SyncOrAsyncResult<
  void | null | undefined
  /** false means you want to prevent leave   */
  | boolean
  | { redirect: string, replace?: boolean }>;

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


export class Router {
  constructor(public routes: RouteConfig[]) {
    dom.listen(this.trigger);
  }

  /**
   * Runs through the config and triggers an routes that matches the current path
   */
  init() {
    dom.oldLocation = dom.readLocation();
    
    return this.trigger({ oldLocation: '', newLocation: dom.readLocation() });
  }

  destroy() {
    dom.unlisten();
  }

  /**
   * Enables pure html5 routing.
   * NOTE: 
   * - Server must support returning the same page on route triggers.
   * - Your browser targets support pushState: https://caniuse.com/#search=pushstate
   */
  enableHtml5Routing(baseUrlOrOptions: string | Html5RoutingOptions = '') {
    if(typeof baseUrlOrOptions === 'string') {
      dom.html5Base = baseUrlOrOptions;
    } else {
      dom.html5Base = baseUrlOrOptions.baseUrl === undefined ? '' : baseUrlOrOptions.baseUrl;
      dom.html5RoutingOptions = baseUrlOrOptions;
    }
    return this;
  }

  private trigger = async ({ oldLocation, newLocation }: dom.ChangeEvent) => {
    const oldPath = oldLocation;
    const newPath = newLocation;

    /** leaving */
    for (const config of this.routes) {
      const pattern = config.$;

      if (match({ pattern, path: oldPath })) {

        if (config.beforeLeave) {
          const result = await config.beforeLeave({ oldPath, newPath });
          if (result == null) {
            /** nothing to do */
          }
          else if (typeof result === 'boolean') {
            if (result === false) {
              navigate(oldLocation, true);
              return;
            }
          }
          else if (result.redirect) {
            navigate(result.redirect, result.replace);
            return;
          }
        }
      }
    }

    /** entering */
    for (const config of this.routes) {
      const pattern = config.$;

      const enterMatch = match({ pattern, path: newPath });
      if (enterMatch) {
        if (enterMatch.remainingPath) {
          continue;
        }

        const params = enterMatch.params;

        /** beforeEnter */
        if (config.beforeEnter) {
          const result = await config.beforeEnter({ oldPath, newPath, params });
          if (result == null) {
            /** nothing to do */
          }
          else if (result.redirect) {
            navigate(result.redirect, result.replace);
            return;
          }
        }

        /** enter */
        if (config.enter) {
          const result = await config.enter({ oldPath, newPath, params });
          return;
        }
      }
    }
  }
}

function transformHtml5Path(path: string) {
  const {hash, search} = dom.dloc;
  return dom.html5RoutingOptions && dom.html5RoutingOptions.appendQueryParams 
    ? `${path.replace(/\?(.*)/, '')}${search}${hash}`
    : path;
}

/**
 * Navigates to the given path
 */
export function navigate(path: string, replace?: boolean) {
  const html5Path = transformHtml5Path(path);

  dom.html5ModeEnabled()
    ? dom.setLocation(`${dom.html5Base}${html5Path}`, !!replace)
    : dom.setLocation(`#${path}`, !!replace);
}

/**
 * Gives you a link that when triggered, navigates to the given path
 */
export function link(path: string) {
  const html5Path = transformHtml5Path(path);

  return dom.html5ModeEnabled()
    ? `${dom.html5Base!}${html5Path}`
    /** 
     * Needs `./` to prevent accessibility error `link refers to non existing element`
     * 
     * e.g. 
     * path `/foo` => `./#/foo`
     **/
    : `./#${path}`;
}

/** 
 * Returns true if a modifier key is down.
 */
const isModifiedEvent = (event: MouseEvent): boolean => Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

/** 
 * Suppresses browser default `click` behaviour on link
 */
export const html5LinkOnClick = ({
  event,
  replace = false
}: {
  event: MouseEvent,
  replace?: boolean
}) => {
  const linkElement = event.target as HTMLLinkElement;
  if (
    !event.defaultPrevented && // onClick prevented default
    event.button === 0 && // ignore everything but left clicks
    !(linkElement).target && // let browser handle "target=_blank" etc.
    !isModifiedEvent(event) // ignore clicks with modifier keys
  ) {
    event.preventDefault();

    const location = linkElement.href;
    dom.setLocation(location, !!replace);
  }
}
