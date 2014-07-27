/**
 * Created by liangyali on 14/7/25.
 */

var OAuth = require('../../lib/oauth.js');
var should = require('should');

var oauth = new OAuth();

oauth.setting({
    appId: 'appid',
    appSecret: 'appSecret'
});

describe('OAuth', function () {

    it('返回不能为空', function () {
        var url = oauth.getAuthorizeUrl('http://liangyali.com');
        url.should.be.not.empty;
    });

    it('返回正确的Url(包含：redirect)', function () {
        var url = oauth.getAuthorizeUrl('http://liangyali.com');
        url.should.not.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Fliangyali.com%2F&response_type=code&scope=snsapi_base&state=#wechat_redirect');
    });

    it('返回正确的Url(包含：redirect state)', function () {
        var url = oauth.getAuthorizeUrl('http://liangyali.com', 'test');
        url.should.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Fliangyali.com&response_type=code&scope=snsapi_base&state=test#wechat_redirect');
    });

    it('返回正确的Url(包含：redirect state scope)', function () {
        var url = oauth.getAuthorizeUrl('http://liangyali.com', 'test', 'snsapi_userinfo');
        url.should.be.equal('https://open.weixin.qq.com/connect/oauth2/authorize?appid=appid&redirect_uri=http%3A%2F%2Fliangyali.com&response_type=code&scope=snsapi_userinfo&state=test#wechat_redirect');
    });
});



