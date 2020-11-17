"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var match_1 = require("../match");
var assert = require("assert");
describe('match', function () {
    it('should match strings', function () {
        var res = match_1.match({
            pattern: '/foo/bar',
            path: '/foo/bar'
        });
        assert.deepEqual(res, {
            remainingPath: '',
            params: {}
        });
    });
    it('should match strings ending with :params', function () {
        var res = match_1.match({
            pattern: '/foo/:bar',
            path: '/foo/bar'
        });
        assert.deepEqual(res, {
            remainingPath: '',
            params: {
                bar: 'bar'
            }
        });
    });
    it('should match strings containing :params', function () {
        var res = match_1.match({
            pattern: '/foo/:bar/baz',
            path: '/foo/bar/baz'
        });
        assert.deepEqual(res, {
            remainingPath: '',
            params: {
                bar: 'bar'
            }
        });
    });
    it('should match strings containing n :params', function () {
        var res = match_1.match({
            pattern: '/foo/:bar/:baz',
            path: '/foo/bar/baz'
        });
        assert.deepEqual(res, {
            remainingPath: '',
            params: {
                bar: 'bar',
                baz: 'baz'
            }
        });
    });
    it('should match path too long', function () {
        var res = match_1.match({
            pattern: '/foo',
            path: '/foo/bar'
        });
        assert.deepEqual(res, {
            remainingPath: '/bar',
            params: {}
        });
    });
    "Greedy vs. non-greedy\n/*/c matches /you/are/okay/c\n/*/c does not match /you/are/cool/c\n/**/c matches /you/are/cool/c\n";
    it('match *', function () {
        assert.deepEqual(match_1.match({
            pattern: '/*/c',
            path: '/you/arc/okay/c'
        }), {
            remainingPath: '',
            params: {
                splat: 'you/arc/okay'
            }
        });
        assert.deepEqual(match_1.match({
            pattern: '/*/c',
            path: '/you/arc/cool/c'
        }), null);
    });
    it('should match **', function () {
        assert.deepEqual(match_1.match({
            pattern: '/foo/**/',
            path: '/foo/bar/bas/'
        }), {
            remainingPath: '',
            params: {
                splat: 'bar/bas'
            }
        });
    });
    it('should not match path too short', function () {
        var res = match_1.match({
            pattern: '/foo/bar',
            path: '/foo'
        });
        assert.deepEqual(res, null);
    });
    it('should match path if optional', function () {
        var res = match_1.match({
            pattern: '/foo(/bar)',
            path: '/foo'
        });
        assert.deepEqual(res, {
            remainingPath: '',
            params: {}
        });
    });
});
