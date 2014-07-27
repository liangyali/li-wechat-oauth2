/*
 * li-wechat-oauth2
 * http://www.liangyali.com
 *
 * Copyright (c) 2014 liangyali
 * Licensed under the MIT license.
 */

'use strict';

function AccessToken(token) {
    if (!(this instanceof AccessToken)) {
        return new AccessToken(token);
    }

    this.rawToken = token || {};
}

AccessToken.prototype.isExpire = function () {
    return !!this.rawToken.access_token && (new Date().getTime()) < (this.rawToken.createdDate + this.rawToken.expires_in * 1000);
};

module.exports = AccessToken;