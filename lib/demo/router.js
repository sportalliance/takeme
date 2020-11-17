"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var routeState_1 = require("./routeState");
var links_1 = require("./links");
exports.router = new index_1.Router([
    {
        $: links_1.links.login(),
        enter: function () { return routeState_1.routeState.setRoute({ type: 'login' }); }
    },
    {
        $: links_1.links.profile(':profileId'),
        enter: function (_a) {
            var profileId = _a.params.profileId;
            routeState_1.routeState.setRoute({ type: 'profile', profileId: profileId });
        },
        beforeEnter: function () {
            if (!routeState_1.routeState.loggedIn) {
                routeState_1.routeState.setLoginRequiredMessage('You need to login before you can visit a profile page');
                return { redirect: links_1.links.login() };
            }
        },
    },
    { $: '*', enter: function () { return routeState_1.routeState.setRoute({ type: 'login' }); } },
]);
