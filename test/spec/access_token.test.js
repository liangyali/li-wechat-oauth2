/**
 * Created by liangyali on 14/7/26.
 */

var AccessToken = require('../../lib/access_token');

describe('AccessToken测试', function () {

    it('测试AccessToken没有过期', function () {

        var accessToken = AccessToken({
            access_token: 'test',
            expires_in: 7200,
            createdDate: new Date().getTime()
        });

        console.log(accessToken);

        var expire = accessToken.isExpire();
        expire.should.be.true;
    });

    it('测试AccessToken没有过期', function () {

        var accessToken = AccessToken({
            access_token: 'test',
            expires_in: 0,
            createdDate: new Date().getTime()
        });

        var expire = accessToken.isExpire();
        expire.should.be.false;
    });
});
