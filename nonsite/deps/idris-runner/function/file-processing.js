const path = require('path');
const os = require('os');
const fs = require('fs');
var exec = require('child_process').exec;

// prelude is?: /home/donald_pinckney/.cabal/share/x86_64-linux-ghc-8.0.2/idris-1.3.1/

// somedir/Main.idr

function processUploads(uploads, tmpdir, command, callback) {
    // All of the uploads are stored in tmpdir
    
    // var command = "--check";
    var idrisCommand = null;
    var replCommand = null;

    if (command.action == "check") {
        if(command.file !== undefined) {
            idrisCommand = `--check ${command.file}`; // -e axom4
        }
    } else if (command.action == "typeof") {
        if(command.file !== undefined && command.expr !== undefined) {
            idrisCommand = `${command.file}`;
            replCommand = `:t ${command.expr}`;
        }
    }

    if(idrisCommand === null) {
        callback(`Error: unrecognized command ${command}`);
        return;
    }

    var cmd;
    if(replCommand === null) {
        cmd = `./idris_command.sh "${tmpdir}" "${idrisCommand}"`;
    } else {
        cmd = `./idris_command_repl.sh "${tmpdir}" "${idrisCommand}" "${replCommand}"`;
    }
    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        // res.status(200).send(stdout);
        var res = {
            idrisOutput: stdout
        };
        callback(JSON.stringify(res));
    });

    // var result = "";

    // for(const idx in uploads) {
    //     const filePath = uploads[idx];
    //     const contents = fs.readFileSync(filePath, 'utf8');
    //     result += `File path ${filePath}, contents: ${contents}\n`;
    // }

    // callback(result);
}

exports.processUploads = processUploads;