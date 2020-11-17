"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Normalize JS */
require("core-js");
/** Normaize CSS */
var csstips_1 = require("csstips");
csstips_1.normalize();
var typestyle_1 = require("typestyle");
var React = require("react");
var ReactDOM = require("react-dom");
var routeState_1 = require("./routeState");
var mobx_react_1 = require("mobx-react");
var router_1 = require("./router");
var index_1 = require("../index");
var links_1 = require("./links");
/**
 * Some page CSS customizations.
 * Note: Creating componentized CSS would detract from the points of the demo
 */
typestyle_1.cssRaw("\n#root {\n  padding: 10px;\n}\n");
var components_1 = require("./ui/components");
/**
 * A sample nav
 */
exports.Nav = mobx_react_1.observer(function () {
    return React.createElement(components_1.Vertical, null,
        routeState_1.routeState.loggedIn && React.createElement(components_1.Horizontal, null,
            React.createElement("a", { href: index_1.link(links_1.links.profile('dave')) }, "Dave"),
            React.createElement("a", { href: index_1.link(links_1.links.profile('john')) }, "John")),
        routeState_1.routeState.loggedIn && React.createElement(components_1.Button, { onClick: function () { return routeState_1.routeState.logout(); } }, "Logout"),
        React.createElement(components_1.Horizontal, null,
            React.createElement("a", { href: 'https://github.com/basarat/takeme/tree/master/src/demo', target: "_blank" }, "Code for the demo"),
            React.createElement("a", { href: 'http://basarat.com/takeme', target: "_blank" }, "takeme Docs"),
            React.createElement("a", { href: 'https://github.com/basarat/takeme', target: "_blank" }, "Star it on github \u2B50")));
});
/**
 * Pages
 */
exports.Login = mobx_react_1.observer(function () {
    return React.createElement(components_1.Vertical, null,
        React.createElement("h3", null, "Login Page"),
        !routeState_1.routeState.loggedIn && React.createElement(components_1.Button, { onClick: function () { return routeState_1.routeState.login(); } }, "Click here to login"),
        routeState_1.routeState.loggedIn && React.createElement(components_1.AlertSuccess, null, "You are logged in! Visit some profile page :)"),
        routeState_1.routeState.loginRequiredMessage && React.createElement(components_1.Alert, null, routeState_1.routeState.loginRequiredMessage),
        React.createElement(exports.Nav, null));
});
exports.Profile = mobx_react_1.observer(function (_a) {
    var profileId = _a.profileId;
    return React.createElement(components_1.Vertical, null,
        React.createElement("h3", null,
            "Profile of : ",
            profileId),
        React.createElement(exports.Nav, null));
});
/**
 * Route -> Page
 */
var Page = mobx_react_1.observer(function () {
    switch (routeState_1.routeState.route.type) {
        case 'login': return React.createElement(exports.Login, null);
        case 'profile': return React.createElement(exports.Profile, { profileId: routeState_1.routeState.route.profileId });
        default:
            var _ensure = routeState_1.routeState.route;
            return React.createElement("noscript", null);
    }
});
/**
 * Kickoff
 */
ReactDOM.render(React.createElement(Page, null), document.getElementById('root'));
router_1.router.init();
typestyle_1.forceRenderStyles();
/** Set stateful modules */
var fuse_hmr_1 = require("fuse-hmr");
fuse_hmr_1.setStatefulModules(FuseBox, ['routeState']);
