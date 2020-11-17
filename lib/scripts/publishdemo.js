var ghpages = require('gh-pages');
var path = require('path');
var date = new Date();
/** Build demos */
console.log("--running publish--");
ghpages.publish(__dirname + '/../../demo', {
    message: "[ci skip] deployment (" + date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + "-" + date.getUTCHours() + "-" + date.getUTCMinutes() + ")",
    /** Branch */
    branch: 'master',
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/basarat/takeme-demo.git',
    /** User */
    user: {
        name: 'basarat',
        email: 'basarat@example.com'
    }
}, function (err) {
    if (err) {
        console.log('--publish failed!--', err);
        return;
    }
    console.log("--publish done--");
});
