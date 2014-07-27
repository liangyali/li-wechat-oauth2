/**
 * Created by liangyali on 14/7/26.
 */

var CacheTokenStrore = require('../../lib/cache_token_store');

describe('缓存Token存储测试', function () {
    var cache = new CacheTokenStrore();

    it('测试Set', function (done) {
        cache.set('item01', {access_token: 'p001'}, function (err, token) {
            if (err) {
                done(err);
            }

            token.access_token.should.be.equal('p001');
            done();
        });
    });

    it('测试Get', function (done) {
        cache.set('item01', {access_token: 'p001'}, function (err, token) {
            if (err) {
                done(err);
            }

            cache.get('item01', function (err, token) {
                if (err) {
                    done(err);
                }

                token.access_token.should.be.equal('p001');
                done();
            });
        });
    });

    it('测试名称', function () {
        cache.name().should.be.equal('cacheTokenStrore');
    });

    it('测试获取不从在值', function () {
        cache.get('p002', function (err, token) {
            var token = token || 'default';
            token.should.be.equal('default');
        });
    });
});
