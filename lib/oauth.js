/*
 * li-wechat-oauth2
 * http://www.liangyali.com
 *
 * Copyright (c) 2014 liangyali
 * Licensed under the MIT license.
 */

'use strict';

var events = require('events');
var util = require('util');
var request = require('request');
var querystring = require('querystring');

var CacheTokenStore = require('./cache_token_store');
var AccessToken = require('./access_token');

var authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
var accessTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
var refreshTokenUrl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';

function OAuth() {

    this.tokenStore = new CacheTokenStore();

    events.EventEmitter.call(this);
}

util.inherits(OAuth, events.EventEmitter);

/**
 * 设置OAuth参数
 * @param {Object} options
 *
 * {
 *      appId:{AppId},
 *      appSecret:{appSecret},
 * }
 */
OAuth.prototype.setting = function (options) {
    this.appId = options.appId || '';
    this.appSecret = options.appSecret || '';
    this.tokenStore = options.tokenStore || this.tokenStore;
};

/**
 * 获取验证地址
 * @param {String} redirect
 * @param {String} state
 * @param {String} scope
 * @returns {String}
 */
OAuth.prototype.getAuthorizeUrl = function (redirect, state, scope) {
    var qs = {
        appid: this.appId,
        redirect_uri: redirect,
        response_type: 'code',
        scope: scope || 'snsapi_base',
        state: state || ''
    };

    return util.format('%s?%s#wechat_redirect', authorizeUrl, querystring.stringify(qs));
};

/**
 * 使用code获取accessToken和openid
 * @param code
 * @param callback
 */
OAuth.prototype.auth = function (code, callback) {
    if (!code) {
        callback(new Error('code is required!'));
    }

    if (typeof code !== 'string') {
        return callback(new Error('code must be string!'));
    }

    if (!callback || typeof callback !== 'function') {
        return callback(new Error('callback is required!'));
    }

    var query = {
        appid: this.appId,
        secret: this.appSecret,
        code: code,
        grant_type: 'authorization_code'
    };

    var self = this;

    request(accessTokenUrl, {json: true, qs: query}, function (err, res, token) {

        //设置accessToken的创建时间
        self._processToken(token);

        self.store.set(token, function (err, token) {
            callback(err, new AccessToken(token));
        });
    });
};

/**
 * 更新AccessToken
 * @param token
 * @param callback
 */
OAuth.prototype.refreshToken = function (callback) {
    var query = {
        appid: this.appId,
        grant_type: 'refresh_token',
        refresh_token: 'refresh_token'
    };

    var self = this;

    request(refreshTokenUrl, {json: true, qs: query}, function (err, res, token) {
        //处理AccessToken,设置access_token
        self._processToken(token);
        token.access_token = token.refresh_token;
        self.store.set(token.openid, token, function (err, token) {
            callback(err, new AccessToken(token));
        });
    });
};

OAuth.prototype._processToken = function (token) {
    token = token || {};
    token.createdDate = new Date().getTime();
};

/**
 * 获取code接收中间件
 * @returns {Function}
 */
OAuth.prototype.sigin = function () {
    var self = this;
    return function (req, res, next) {
        self.auth(req.query.code, function (err, result) {
            if (err) {
                return next(err);
            }
            res.locals.accessToken = result;
            return next();
        });
    };
};

/**
 * 获取AccessToken, 过期自动刷新AccessToken
 */
OAuth.prototype.getAccessToken = function (openid, callback) {
    var self = this;
    this.tokenStore.get(openid, function (err, token) {
        if (token.isExpire()) {
            self.refreshToken(callback);
        }
    });
};

module.exports = OAuth;
