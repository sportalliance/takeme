"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typestyle_1 = require("typestyle");
var React = require("react");
var csstips_1 = require("csstips");
exports.buttonClass = typestyle_1.style({
    fontFamily: 'helvetica',
    cursor: 'pointer',
    height: 'auto',
    padding: "12px 30px 11px",
    border: "1px solid #333",
    borderRadius: '3px',
    color: "white",
    backgroundColor: '#333',
    fontSize: '15px',
    textDecoration: "none",
    lineHeight: "1em",
    outline: 'none',
    transition: 'color .2s, background-color .2s',
    display: 'inline-block',
    $nest: {
        '&:hover': {
            backgroundColor: '#666',
        },
        '&:active': {
            backgroundColor: '#666',
        },
        '&:focus': {
            outline: 'thin dotted',
            outlineColor: "#333"
        }
    }
});
exports.Button = function (props) {
    return React.createElement("button", __assign({}, props, { type: props.type || 'button', className: typestyle_1.classes(exports.buttonClass, props.className) }));
};
exports.Alert = function (props) { return React.createElement("div", { style: { padding: '10px', backgroundColor: '#ffa3a3', color: '#883b3b' } }, props.children); };
exports.AlertSuccess = function (props) { return React.createElement("div", { style: { padding: '10px', backgroundColor: '#f0ffef', color: '#43883b' } }, props.children); };
exports.Vertical = function (_a) {
    var children = _a.children, className = _a.className;
    return React.createElement("div", { className: typestyle_1.classes(typestyle_1.style(csstips_1.verticallySpaced(10)), className), children: children });
};
exports.Horizontal = function (_a) {
    var children = _a.children;
    return React.createElement("div", { className: typestyle_1.style(csstips_1.horizontallySpaced(10)), children: children });
};
exports.fadeIn = typestyle_1.style({
    animationName: typestyle_1.keyframes({
        from: { opacity: 0 }, to: { opacity: 1 },
    }),
    animationDuration: '.5s',
});
