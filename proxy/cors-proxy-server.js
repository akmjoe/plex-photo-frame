// set configuration
var plex = require('./config.js');
console.log(plex.plexPathRoot);

var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));
app.use(express.urlencoded({ extended: true }));

app.post('/', function (req, res, next) {
    // handler for downloading
    var files = req.body.files;
    console.log(files);
    // copy all files to temporary directory
    const fs = require('fs');
    const os = require('os');
    const path = require('path');

    let tmpDir;
    const appPrefix = 'plex-download';
    try {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
        zip = "tar -czf "+path.join(os.tmpdir(), appPrefix+".tar.gz")+" "+tmpDir+"/*";
        // copy files to temporary directory
        var output = '';
        files.forEach(function(file) {
            output += file+'<br>';
            dir = path.join(tmpDir, path.dirname(file));
            console.log(dir);
            if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.copyFileSync(file, path.join(tmpDir,file));
        })
        const child_process = require("child_process");
        child_process.execSync(zip, {
          cwd: os.tmpdir()
        });
        //res.send(output);
        //res.end();
        res.download(path.join(os.tmpdir(), appPrefix+".tar.gz"), appPrefix+".tar.gz", function(error){
            // delete file after download
            fs.rmSync(path.join(os.tmpdir(), appPrefix+".tar.gz"));
        });
        
    }
    catch (err) {
        // handle error
        console.log(err);
        console.error('Failed to create temporary directory!');
        res.end('Unable to create zip file!');
    }
    finally {
        try {
            if (tmpDir) {
                fs.rmSync(tmpDir, { recursive: true });
            }
        }
        catch (e) {
            console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }

});

app.all('*', function (req, res, next) {
    // proxy for plex server
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = plex.plexPathRoot; // Target-URL ie. https://example.com or http://example.com
        if (!targetURL) {
            res.send(500, { error: 'There is no Target url defined in config.js!' });
            return;
        }
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
//                console.log(body);
            }).pipe(res);
    }
});

app.set('port', plex.app.port || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});