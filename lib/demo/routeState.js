"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var index_1 = require("../index");
var links_1 = require("./links");
var RouteState = (function () {
    function RouteState() {
        this.route = {
            type: 'login'
        };
        this.loggedIn = false;
        this.loginRequiredMessage = '';
    }
    RouteState.prototype.setRoute = function (route) {
        this.route = route;
    };
    RouteState.prototype.login = function () {
        this.loggedIn = true;
        this.loginRequiredMessage = '';
    };
    RouteState.prototype.logout = function () {
        this.loggedIn = false;
        index_1.navigate(links_1.links.login());
    };
    RouteState.prototype.setLoginRequiredMessage = function (message) {
        this.loginRequiredMessage = message;
    };
    __decorate([
        mobx_1.observable
    ], RouteState.prototype, "route", void 0);
    __decorate([
        mobx_1.action
    ], RouteState.prototype, "setRoute", null);
    __decorate([
        mobx_1.observable
    ], RouteState.prototype, "loggedIn", void 0);
    __decorate([
        mobx_1.action
    ], RouteState.prototype, "login", null);
    __decorate([
        mobx_1.action
    ], RouteState.prototype, "logout", null);
    __decorate([
        mobx_1.observable
    ], RouteState.prototype, "loginRequiredMessage", void 0);
    __decorate([
        mobx_1.action
    ], RouteState.prototype, "setLoginRequiredMessage", null);
    return RouteState;
}());
exports.RouteState = RouteState;
exports.routeState = new RouteState();
