const express = require('express');
bodyParcer = require('body-parser');
const request = require('request');
const http = require('http');
const app = express();
var sf = require('node-salesforce');



app.use( bodyParcer.urlencoded({extended: true}) );
app.use( bodyParcer.json() );

var posts = [
    {title : "My First post 1", content: "1wdaedawdawdawdawd"},
    {title : "My First post 2", content: "22222222222wd"},
    {title : "My First post 3", content: "333333333dawdawdawdawd"}
];

app.get('/', function (req, res) {
    res.render('index.ejs', { posts: posts } );
});

app.get("/callback", function (req, res) {
    console.log('my CODE = ' + req.param('code'));
    var codeUrl = req.query;
    console.log('query = ' + codeUrl.code);

    var conn = new sf.Connection({ oauth2 : oauth2 });
    var code = req.param('code');

    var oauth2 = new sf.OAuth2({
        // you can change loginUrl to connect to sandbox or prerelease env.
        // loginUrl : 'https://test.salesforce.com',
        clientId : '3MVG9G9pzCUSkzZtjYVaRpHLTcvjkathl2nrl06zSaA5h6iTagnQJ0ktvCO5gpluAXPC84xas_K.zEHW_oynd',
        clientSecret : 'F31069EADF519941FEC58E9FDE88FA51D768492FF1A3034C63339D7FB3F3FACE',
        redirectUri : '/callback2'
    });

    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token, refresh token, and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.refreshToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        // ...
    });

   /* request.post({
        headers: {'content-type' : 'application/json'},
        url:     'http://login.salesforce.com/services/oauth2/token',
        body:    body
    }, function(error, response, body){
        console.log('bodyResp = ' + body);
        console.log('Error = ' + error);
        console.log('response = ' + response);

        res.render('post.ejs', { post: posts[1] } );
    });*/



});


app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening1111 on port 3000!');
});
