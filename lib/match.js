"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invariant(condition, message) {
    if (condition) {
        throw new Error(message);
    }
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function _compilePattern(pattern) {
    var regexpSource = '';
    var paramNames = [];
    var tokens = [];
    var match, lastIndex = 0, matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
    while ((match = matcher.exec(pattern))) {
        if (match.index !== lastIndex) {
            tokens.push(pattern.slice(lastIndex, match.index));
            regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
        }
        if (match[1]) {
            regexpSource += '([^/]+)';
            paramNames.push(match[1]);
        }
        else if (match[0] === '**') {
            regexpSource += '(.*)';
            paramNames.push('splat');
        }
        else if (match[0] === '*') {
            regexpSource += '(.*?)';
            paramNames.push('splat');
        }
        else if (match[0] === '(') {
            regexpSource += '(?:';
        }
        else if (match[0] === ')') {
            regexpSource += ')?';
        }
        tokens.push(match[0]);
        lastIndex = matcher.lastIndex;
    }
    if (lastIndex !== pattern.length) {
        tokens.push(pattern.slice(lastIndex, pattern.length));
        regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
    }
    return {
        pattern: pattern,
        regexpSource: regexpSource,
        paramNames: paramNames,
        tokens: tokens
    };
}
var CompiledPatternsCache = Object.create(null);
function compilePattern(pattern) {
    if (!CompiledPatternsCache[pattern])
        CompiledPatternsCache[pattern] = _compilePattern(pattern);
    return CompiledPatternsCache[pattern];
}
/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 * - **             Consumes (greedy) all characters up to the next character
 *                  in the pattern, or to the end of the URL if there is none
 */
function match(_a) {
    var pattern = _a.pattern, path = _a.path;
    // Ensure pattern starts with leading slash for consistency with pathname.
    if (pattern.charAt(0) !== '/') {
        pattern = "/" + pattern;
    }
    var _b = compilePattern(pattern), regexpSource = _b.regexpSource, paramNames = _b.paramNames, tokens = _b.tokens;
    if (pattern.charAt(pattern.length - 1) !== '/') {
        regexpSource += '/?'; // Allow optional path separator at end.
    }
    // Special-case patterns like '*' for catch-all routes.
    if (tokens[tokens.length - 1] === '*') {
        regexpSource += '$';
    }
    var match = path.match(new RegExp("^" + regexpSource, 'i'));
    if (match == null) {
        return null;
    }
    var matchedPath = match[0];
    var remainingPath = path.substr(matchedPath.length);
    if (remainingPath) {
        // Require that the match ends at a path separator, if we didn't match
        // the full path, so any remaining pathname is a new path segment.
        if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
            return null;
        }
        // If there is a remaining pathname, treat the path separator as part of
        // the remaining pathname for properly continuing the match.
        remainingPath = "/" + remainingPath;
    }
    /**
     * Compose the param names and values into an object
     */
    var paramValues = match.slice(1).map(function (v) { return v && decodeURIComponent(v); });
    var params = {};
    paramNames.forEach(function (paramName, index) {
        params[paramName] = paramValues[index];
    });
    return {
        remainingPath: remainingPath,
        params: params
    };
}
exports.match = match;
