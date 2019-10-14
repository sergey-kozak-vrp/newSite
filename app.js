const express = require('express');
bodyParcer = require('body-parser');
const request = require('request');
const http = require('http');
const app = express();
var sf = require('node-salesforce');


app.use(bodyParcer.urlencoded({extended: true}));
app.use(bodyParcer.json());
app.use(express.static(__dirname + '/views'));

var posts = [
    {title: "My First post 1", content: "1wdaedawdawdawdawd"},
    {title: "My First post 2", content: "22222222222wd"},
    {title: "My First post 3", content: "333333333dawdawdawdawd"}
];

var oauth2 = new sf.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl: 'https://login.salesforce.com',
    clientId: '3MVG9G9pzCUSkzZtjYVaRpHLTcvjkathl2nrl06zSaA5h6iTagnQJ0ktvCO5gpluAXPC84xas_K.zEHW_oynd',
    clientSecret: 'F31069EADF519941FEC58E9FDE88FA51D768492FF1A3034C63339D7FB3F3FACE',
    redirectUri: 'https://newsite1.herokuapp.com/callback'
});

var conn = new sf.Connection({oauth2: oauth2});

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/oauth2/auth', function (req, res) {
    console.log(oauth2.getAuthorizationUrl());
    res.redirect(oauth2.getAuthorizationUrl());
});
app.get("/callback", function (req, res) {
    console.log('my CODE = ' + req.param('code'));
    var codeUrl = req.query;
    console.log('query = ' + codeUrl.code);


    var code = req.param('code');
    /*
        var oauth2 = new sf.OAuth2({
            // you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl : 'https://login.salesforce.com',
            clientId : '3MVG9G9pzCUSkzZtjYVaRpHLTcvjkathl2nrl06zSaA5h6iTagnQJ0ktvCO5gpluAXPC84xas_K.zEHW_oynd',
            clientSecret : 'F31069EADF519941FEC58E9FDE88FA51D768492FF1A3034C63339D7FB3F3FACE',
            redirectUri : 'https://newsite1.herokuapp.com/callback2'
        }); */
    var conn = new sf.Connection({oauth2: oauth2});

    conn.authorize(code, function (err, userInfo) {
        if (err) {
            return console.error(err);
        }
        // Now you can get the access token, refresh token, and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.refreshToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        var accessToken = conn.accessToken;
        var auhorization = 'Bearer ' + accessToken;
        var getUrl = conn.instanceUrl + '/services/apexrest/auth_package_for_milko/checkUserAccess/' + '?userId='+userInfo.id;

        request.get({
            headers: {
                'content-type': 'application/json',
                'Authorization': auhorization
            },
            url: getUrl
        }, function (error, response, body) {
            console.log('bodyResp = ' + body);
            console.log('Error = ' + error);
            console.log('response = ' + response);

            res.render('post.ejs', {post: "You connection SUCCESS. License msg = :" + body});
        });


        // ...
    });


});


app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening1111 on port 3000!');
});
