var exec = require('child_process').exec;
const util = require('util');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
var mkdirp = require('mkdirp');

// var cmd = 'cabal-bin/idris -v';

// prelude is?: /home/donald_pinckney/.cabal/share/x86_64-linux-ghc-8.0.2/idris-1.3.1/


exports.idrisrunner = (req, res) => {
    // let message = req.query.message || req.body.message || 'Hello World!';
    // let cmd = req.body;

    // exec(cmd, function(error, stdout, stderr) {
    //     // command output is in stdout
    //     res.status(200).send(stdout);
    // });

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }



    // if (req.method !== 'POST') {
    //     // Return a "method not allowed" error
    //     return res.status(405).end();
    // }

    const busboy = new Busboy({headers: req.headers});
    const tmpdir = path.join(os.tmpdir(), 'src/');
    mkdirp(tmpdir, function(err) {
        // This object will accumulate all the fields, keyed by their name
        const fields = {};

        // This object will accumulate all the uploaded files, keyed by their name.
        const uploads = [];

        var logStr = "";

        // This code will process each non-file field in the form.

        busboy.on('field', (fieldname, val) => {
            // TODO(developer): Process submitted field values here
            logStr += `Processed field ${fieldname}: ${val}.`;
            fields[fieldname] = val;
        });

        const fileWrites = [];

        // This code will process each file uploaded.
        busboy.on('file', (fieldname, file, filename) => {
            // Note: os.tmpdir() points to an in-memory file system on GCF
            // Thus, any files in it must fit in the instance's memory.
            // logStr += `Processed file ${filename}`;
            const filepath = path.join(tmpdir, filename);
            // uploads[fieldname] = filepath;
            uploads.push(filepath)

            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);

            // File was processed by Busboy; wait for it to be written to disk.
            const promise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    writeStream.end();
                });
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            fileWrites.push(promise);
        });

        // Triggered once all uploaded files are processed by Busboy.
        // We still need to wait for the disk writes (saves) to complete.
        busboy.on('finish', () => {
            Promise.all(fileWrites).then(() => {
                // Process files
                for(const idx in uploads) {
                    const filepath = uploads[idx];
                    const contents = fs.readFileSync(filepath, 'utf8');
                    logStr += `Filepath ${filepath}, contents: ${contents}\n`
                }

                // Delete all the temp files
                for (const idx in uploads) {
                    const filepath = uploads[idx];
                    fs.unlinkSync(filepath);
                }
                res.status(200).send(logStr);
            });
        });

        busboy.end(req.rawBody);

    });

    // var desc = {body: req.body, method: req.method, query: req.query, headers: req.headers};

    // var resStr = util.inspect(desc, {showHidden: false, depth: null});
    // console.log(resStr);

    // res.status(200).send(resStr);
};

