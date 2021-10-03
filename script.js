const fs = require('fs');
const https = require('https');
const stream = require('stream').Transform;
const app = express = require('express')();
const shell = require('shelljs');

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.post('/download', (req, res) => {
    var url = JSON.stringify(req.body.url).split('"')[1];
    var filename = url.split('/')[5];

    shell.mkdir('-p', req.body.filepath);

    https.request(url, function (response) {
        var data = new stream();

        response.on('data', function (chunk) {
            data.push(chunk);
        });

        response.on('end', function () {
            fs.writeFile(req.body.filepath + filename, data.read(), 'binary', (err) => {
                if (err) {
                    res.send('Error');
                }
                else {
                    res.send('Success');
                }
            });
        });
    }).end();
});

app.listen(3000, () => {
    console.log('wait for request');
});