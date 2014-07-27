/**
 * 缓存AccessToken存在实现
 */

function CacheTokenStore() {
    this.store = {};
}

/**
 *  设置Token
 * @param {String} key
 * @param {Object} token
 */
CacheTokenStore.prototype.set = function (key, token, callback) {
    this.store[key] = token;
    callback(null, token);
};

/**
 * 获取Token
 * @param openid
 * @returns {*}
 */
CacheTokenStore.prototype.get = function (key, callback) {
    callback(null, this.store[key]);
};

/**
 * 获取Store的名称
 * @returns {string}
 */
CacheTokenStore.prototype.name = function () {
    return 'cacheTokenStrore';
};

module.exports = CacheTokenStore;
