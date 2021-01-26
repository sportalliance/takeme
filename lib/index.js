"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("./match");
exports.match = match_1.match;
var dom;
(function (dom) {
    /** Serverside safe document.location */
    var dloc = typeof document !== 'undefined' ? document.location : { hash: '' };
    dom.html5Base = null;
    dom.html5RoutingOptions = {};
    function html5ModeEnabled() {
        return dom.html5Base !== null;
    }
    dom.html5ModeEnabled = html5ModeEnabled;
    function readLocation() {
        if (dom.html5Base == null) {
            var hash = 
            // When url shows '#'
            // - Non-IE browsers return ''
            // - IE returns '#'
            (dloc.hash === '' || dloc.hash === '#')
                ? '/'
                : dloc.hash.substring(1);
            return hash;
        }
        else {
            return window.location.pathname.substr(dom.html5Base.length);
        }
    }
    dom.readLocation = readLocation;
    /**
     * Used to track the last value set.
     * if it does not change we ignore events
     */
    dom.oldLocation = readLocation();
    function setLocation(location, replace) {
        if (readLocation() === location)
            return;
        if (typeof history !== 'undefined' && history.pushState) {
            if (replace) {
                history.replaceState({}, document.title, location);
            }
            else {
                history.pushState({}, document.title, location);
            }
            /**
             * Just calling history.pushState() or history.replaceState() won't trigger a popstate event
             */
            fire();
        }
        else {
            dloc.hash = location;
        }
        dom.oldLocation = readLocation();
    }
    dom.setLocation = setLocation;
    var listeners = [];
    var fire = function () {
        var newLocation = readLocation();
        if (dom.oldLocation === newLocation)
            return;
        listeners.forEach(function (l) { return l({ oldLocation: dom.oldLocation, newLocation: newLocation }); });
        dom.oldLocation = newLocation;
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', fire, false);
        window.addEventListener('popstate', fire);
    }
    function listen(cb) {
        listeners.push(cb);
        return function () {
            listeners = listeners.filter(function (l) { return l !== cb; });
        };
    }
    dom.listen = listen;
    function unlisten() {
        listeners = [];
    }
    dom.unlisten = unlisten;
})(dom || (dom = {}));
var Router = (function () {
    function Router(routes) {
        var _this = this;
        this.routes = routes;
        this.trigger = function (_a) {
            var oldLocation = _a.oldLocation, newLocation = _a.newLocation;
            return __awaiter(_this, void 0, void 0, function () {
                var oldPath, newPath, _i, _a, config, pattern, result, _b, _c, config, pattern, enterMatch, params, result, result;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            oldPath = oldLocation;
                            newPath = newLocation;
                            _i = 0, _a = this.routes;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            config = _a[_i];
                            pattern = config.$;
                            if (!match_1.match({ pattern: pattern, path: oldPath })) return [3 /*break*/, 3];
                            if (!config.beforeLeave) return [3 /*break*/, 3];
                            return [4 /*yield*/, config.beforeLeave({ oldPath: oldPath, newPath: newPath })];
                        case 2:
                            result = _d.sent();
                            if (result == null) {
                                /** nothing to do */
                            }
                            else if (typeof result === 'boolean') {
                                if (result === false) {
                                    navigate(oldLocation, true);
                                    return [2 /*return*/];
                                }
                            }
                            else if (result.redirect) {
                                navigate(result.redirect, result.replace);
                                return [2 /*return*/];
                            }
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            _b = 0, _c = this.routes;
                            _d.label = 5;
                        case 5:
                            if (!(_b < _c.length)) return [3 /*break*/, 10];
                            config = _c[_b];
                            pattern = config.$;
                            enterMatch = match_1.match({ pattern: pattern, path: newPath });
                            if (!enterMatch) return [3 /*break*/, 9];
                            if (enterMatch.remainingPath) {
                                return [3 /*break*/, 9];
                            }
                            params = enterMatch.params;
                            if (!config.beforeEnter) return [3 /*break*/, 7];
                            return [4 /*yield*/, config.beforeEnter({ oldPath: oldPath, newPath: newPath, params: params })];
                        case 6:
                            result = _d.sent();
                            if (result == null) {
                                /** nothing to do */
                            }
                            else if (result.redirect) {
                                navigate(result.redirect, result.replace);
                                return [2 /*return*/];
                            }
                            _d.label = 7;
                        case 7:
                            if (!config.enter) return [3 /*break*/, 9];
                            return [4 /*yield*/, config.enter({ oldPath: oldPath, newPath: newPath, params: params })];
                        case 8:
                            result = _d.sent();
                            return [2 /*return*/];
                        case 9:
                            _b++;
                            return [3 /*break*/, 5];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        dom.listen(this.trigger);
    }
    /**
     * Runs through the config and triggers an routes that matches the current path
     */
    Router.prototype.init = function () {
        dom.oldLocation = dom.readLocation();
        return this.trigger({ oldLocation: '', newLocation: dom.readLocation() });
    };
    Router.prototype.destroy = function () {
        dom.unlisten();
    };
    /**
     * Enables pure html5 routing.
     * NOTE:
     * - Server must support returning the same page on route triggers.
     * - Your browser targets support pushState: https://caniuse.com/#search=pushstate
     */
    Router.prototype.enableHtml5Routing = function (baseUrlOrOptions) {
        if (baseUrlOrOptions === void 0) { baseUrlOrOptions = ''; }
        if (typeof baseUrlOrOptions === 'string') {
            dom.html5Base = baseUrlOrOptions;
        }
        else {
            dom.html5Base = baseUrlOrOptions.baseUrl === undefined ? '' : baseUrlOrOptions.baseUrl;
            dom.html5RoutingOptions = baseUrlOrOptions;
        }
        return this;
    };
    return Router;
}());
exports.Router = Router;
function transformHtml5Path(path) {
    var _a = window.location, hash = _a.hash, search = _a.search;
    return dom.html5RoutingOptions && dom.html5RoutingOptions.appendQueryParams
        ? "" + path.replace(/\?(.*)/, '') + search + hash
        : path;
}
/**
 * Navigates to the given path
 */
function navigate(path, replace) {
    var html5Path = transformHtml5Path(path);
    dom.html5ModeEnabled()
        ? dom.setLocation("" + dom.html5Base + html5Path, !!replace)
        : dom.setLocation("#" + path, !!replace);
}
exports.navigate = navigate;
/**
 * Gives you a link that when triggered, navigates to the given path
 */
function link(path) {
    var html5Path = transformHtml5Path(path);
    return dom.html5ModeEnabled()
        ? "" + dom.html5Base + html5Path
        : "./#" + path;
}
exports.link = link;
/**
 * Returns true if a modifier key is down.
 */
var isModifiedEvent = function (event) { return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey); };
/**
 * Suppresses browser default `click` behaviour on link
 */
exports.html5LinkOnClick = function (_a) {
    var event = _a.event, _b = _a.replace, replace = _b === void 0 ? false : _b;
    var linkElement = event.target;
    if (!event.defaultPrevented &&
        event.button === 0 &&
        !(linkElement).target &&
        !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
        event.preventDefault();
        var location_1 = linkElement.href;
        dom.setLocation(location_1, !!replace);
    }
};
