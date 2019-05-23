"use strict";

function get_editor(playpen) {
    let code_block = playpen.querySelector("code");

    if (window.ace && code_block.classList.contains("editable")) {
        let editor = window.ace.edit(code_block);
        return editor;
    } else {
        return null;
    }
}

function playpen_text(playpen) {
    let code_block = playpen.querySelector("code");

    if (window.ace && code_block.classList.contains("editable")) {
        let editor = window.ace.edit(code_block);
        return editor.getValue();
    } else {
        return code_block.textContent;
    }
}

function playpen_get_lang(playpen) {
    var codeBlocks = Array.from(playpen.children).filter(child => child.matches("code"));
    if(codeBlocks.length >= 1) {
        var codeBlock = codeBlocks[0];
        var cls = [].slice.apply(codeBlock.classList);
        var langCls = cls.filter(cl => cl.startsWith("language-") || cl.startsWith("run-language-"));
        if(langCls.length == 1) {
            var lang = langCls[0];
            if(lang.startsWith("run-language-")) {
                lang = lang.replace("run-", "");
            }
            return lang;
        }
    }
    return undefined;
}


(function codeSnippets() {

    // Hide Rust code lines prepended with a specific character
    var hiding_character = "#";

    function initialize_playpens_rust(rust_playpens) {
        // console.log(rust_playpens);

        if (rust_playpens.length > 0) {
            fetch_with_timeout("https://play.rust-lang.org/meta/crates", {
                headers: {
                    'Content-Type': "application/json",
                },
                method: 'POST',
                mode: 'cors',
            })
            .then(response => response.json())
            .then(response => {
                // get list of crates available in the rust playground
                let playground_crates = response.crates.map(item => item["id"]);
                rust_playpens.forEach(block => handle_crate_list_update(block, playground_crates));
            })
            .catch(error => console.error("Could not connect to play.rust-lang.org: " + error.message));
        }

        function handle_crate_list_update(playpen_block, playground_crates) {
            // update the play buttons after receiving the response
            update_play_button(playpen_block, playground_crates);
    
            // and install on change listener to dynamically update ACE editors
            if (window.ace) {
                let code_block = playpen_block.querySelector("code");
                if (code_block.classList.contains("editable")) {
                    let editor = window.ace.edit(code_block);
                    editor.addEventListener("change", function (e) {
                        update_play_button(playpen_block, playground_crates);
                    });
                }
            }
        }
    
        // updates the visibility of play button based on `no_run` class and
        // used crates vs ones available on http://play.rust-lang.org
        function update_play_button(pre_block, playground_crates) {
            var play_button = pre_block.querySelector(".play-button");
    
            // skip if code is `no_run`
            if (pre_block.querySelector('code').classList.contains("no_run")) {
                play_button.classList.add("hidden");
                return;
            }
    
            // get list of `extern crate`'s from snippet
            var txt = playpen_text(pre_block);
            var re = /extern\s+crate\s+([a-zA-Z_0-9]+)\s*;/g;
            var snippet_crates = [];
            var item;
            while (item = re.exec(txt)) {
                snippet_crates.push(item[1]);
            }
    
            // check if all used crates are available on play.rust-lang.org
            var all_available = snippet_crates.every(function (elem) {
                return playground_crates.indexOf(elem) > -1;
            });
    
            if (all_available) {
                play_button.classList.remove("hidden");
            } else {
                play_button.classList.add("hidden");
            }
        }
    }


    function initialize_playpens() {
        var playpens = Array.from(document.querySelectorAll(".playpen"));
        var playpensByLang = {};

        playpens.forEach(playpen => {
            var lang = playpen_get_lang(playpen);
            if(lang !== undefined) {
                if(playpensByLang[lang] === undefined) {
                    playpensByLang[lang] = [playpen];
                } else {
                    playpensByLang[lang].push(playpen);
                }
            }
        });


        if(playpensByLang["language-rust"] !== undefined) {
            initialize_playpens_rust(playpensByLang["language-rust"]);
        }
    }

    initialize_playpens();


    function fetch_with_timeout(url, options, timeout = 6000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
        ]);
    }

    function get_result_block(code_block) {
        var result_block = code_block.querySelector(".result");
        if (!result_block) {
            result_block = document.createElement('code');
            result_block.className = 'result hljs language-bash';

            code_block.append(result_block);
        }
        return result_block;
    }


    var language_dispatch_table = {
        "language-rust": run_rust_code,
        "language-idris": idris_typecheck
    };

    function run_rust_code(block) {
        let code = playpen_text(block);

        var params = {
            version: "stable",
            optimize: "0",
            code: code
        };

        if (code.indexOf("#![feature") !== -1) {
            params.version = "nightly";
        }

        return fetch_with_timeout("https://play.rust-lang.org/evaluate.json", {
            headers: {
                'Content-Type': "application/json",
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(params)
        }).then(response => response.json()).then(response => response.result);
    }

    // @codeFiles: an array of File objects
    function run_idris_files(codeFiles, commandDict) {
        var data = new FormData();
        for(const f of codeFiles) {
            data.append('files[]', f, f.name);
        }

        data.append("command", JSON.stringify(commandDict));

        return fetch_with_timeout("https://us-central1-idrisrunner.cloudfunctions.net/idrisrunner", {
            method: 'POST',
            mode: 'cors',
            body: data
        }, 60000).then(response => response.json());
    }


    function get_idris_token(editor) {
        let sess = editor.getSession();
        let cursor = editor.getCursorPosition();
        let line = sess.getLine(cursor.row);

        function isLeftWord(c) {
            return (65 <= c && c <= 90)     // A-Z
                || (97 <= c && c <= 122)    // a-z
                || (48 <= c && c <= 57)     // 0-9
                || c == 95;                 // _
        }
        function isRightWord(c) {
            return isLeftWord(c);
        }

        // var start = Math.max(cursor.column - 1, 0);
        var start = cursor.column;
        while (start > 0 && isLeftWord(line.charCodeAt(start-1))) {
            start--;
        }

        var endInc = cursor.column - 1;
        while (endInc < line.length - 1 && isRightWord(line.charCodeAt(endInc+1))) {
            endInc++;
        }

        let tok = line.substring(start, endInc + 1);
        // alert(`"${tok}"`);

        return tok;

        // let token = editor.getSession().getTokenAt(cursor.row, cursor.column);
        // if(token.type == "entity.name.function.idris" 
        //     || token.type == "support.constant.prelude.idris" 
        //     || token.type == "support.type.prelude.idris" 
        //     || token.type == "text" 
        //     || token.type == "meta.parameter.named.idris"
        //     || token.type == "meta.function.type-signature.idris"
        //     || token.type == "constant.language.bottom.idris") {
        //     return token.value.trim();
        // } else {
        //     return null;
        // }
    }

//     var res = {
//         displayAction: "showtext",
//         text: stdout
//     };
// } else {
//     var res = {
//         displayAction: "insert",
//         toInsert: stdout,
//         line: command.n
//     };

    function handle_idris_result(code_block, result_block, editor, result) {
        if(result == null || result.displayAction == null) {
            result_block.innerText = "Communication error.";
            return;
        }

        if(result.displayAction == "insert") {
            let sess = editor.getSession();
            sess.insert({row: result.line, column: 0}, result.toInsert + "\n");

            result_block.style.display = 'none';
        } else if(result.displayAction == "replace") {
            let sess = editor.getSession();
            let line = sess.getLine(result.line - 1);
            let replaceRange = new ace.Range(result.line - 1, 0, result.line - 1, line.length);
            sess.replace(replaceRange, result.toReplace);

            result_block.style.display = 'none';
        } else if(result.displayAction == "showtext") {
            if(result.text == null || result.text == "") {
                result_block.innerText = 'No type errors.';
            } else {
                result_block.innerText = result.text;
            }
        } else {
            result_block.innerText = "Unknown display action: " + result.displayAction;
        }
    }

    function idris_action(code_block, editor, waiting_text, actionFn) {
        var result_block = get_result_block(code_block);

        result_block.style.display = 'block';
        result_block.innerText = waiting_text;

        actionFn(code_block, editor)
            .then(result => handle_idris_result(code_block, result_block, editor, result))
            .catch(error => result_block.innerText = "Playground Communication: " + error.message);
    }

    function package_idris_files(block) {
        let code = playpen_text(block);

        let fileName = block.getAttribute("data-path") || "Main.idr";
        var file1 = new File([code], fileName, {
            type: "text/plain"
        });
        return {files: [file1], activeFilename: fileName};
    }

    function idris_typecheck(block, editor = null) {
        let pkg = package_idris_files(block);
        let files = pkg.files;
        
        return run_idris_files(files, {action: "check", file: pkg.activeFilename});
    }

    function idris_typeof(block, editor) {
        let pkg = package_idris_files(block);
        let files = pkg.files;

        let token = get_idris_token(editor);
        if(token == null) {
            return;
        }

        return run_idris_files(files, {action: "typeof", file: pkg.activeFilename, expr: token});
    }

    function idris_add_def(block, editor) {
        let pkg = package_idris_files(block);
        let files = pkg.files;

        let token = get_idris_token(editor);
        if(token == null) {
            return;
        }

        let lineNumber = editor.getCursorPosition().row + 1;
        return run_idris_files(files, {action: "addclause", file: pkg.activeFilename, n: lineNumber, f: token});
    }

    function idris_case_split(block, editor) {
        let pkg = package_idris_files(block);
        let files = pkg.files;

        let token = get_idris_token(editor);
        if(token == null) {
            return;
        }

        let lineNumber = editor.getCursorPosition().row + 1;
        return run_idris_files(files, {action: "casesplit", file: pkg.activeFilename, n: lineNumber, x: token});
    }

    

    


    function run_playpen_code(code_block, lang) {
        var result_block = get_result_block(code_block);

        result_block.innerText = "Running...";

        var runFunc = language_dispatch_table[lang];
        if(lang == "language-idris") {
            let editor = get_editor(code_block);
            idris_action(editor.container.parentNode, editor, "Typechecking...", idris_typecheck);  
        } else if(runFunc !== undefined) {
            runFunc(code_block)
                .then(result => result_block.innerText = result)
                .catch(error => result_block.innerText = "Playground Communication: " + error.message);
        } else {
            result_block.innerText = "Error: can't run " + lang;
        }
    }

    function configure_idris_editor(editor) {
        editor.commands.addCommand({
            name: 'typecheck',
            bindKey: {win: 'Ctrl-Alt-R', mac: 'Ctrl-Alt-R'},
            exec: function(editor) {
                idris_action(editor.container.parentNode, editor, "Typechecking...", idris_typecheck);
            },
            readOnly: true,
        });

        editor.commands.addCommand({
            name: 'typeof',
            bindKey: {win: 'Ctrl-Alt-T', mac: 'Ctrl-Alt-T'},
            exec: function(editor) {
                idris_action(editor.container.parentNode, editor, "Finding type...", idris_typeof);
            },
            readOnly: true,
        });

        editor.commands.addCommand({
            name: 'addclause',
            bindKey: {win: 'Ctrl-Alt-A', mac: 'Ctrl-Alt-A'},
            exec: function(editor) {
                idris_action(editor.container.parentNode, editor, "Adding clause...", idris_add_def);
            },
            readOnly: false,
        });

        editor.commands.addCommand({
            name: 'casesplit',
            bindKey: {win: 'Ctrl-Alt-C', mac: 'Ctrl-Alt-C'},
            exec: function(editor) {
                idris_action(editor.container.parentNode, editor, "Splitting case...", idris_case_split);
            },
            readOnly: false,
        });
    }

    // Syntax highlighting Configuration
    hljs.configure({
        tabReplace: '    ', // 4 spaces
        languages: [],      // Languages used for auto-detection
    });

    if (window.ace) {
        // language-* class needs to be removed for editable
        // blocks or highlightjs will capture events
        // But we also need to keep the language info around so we know how to run it later...
        // We also need to set the language mode for ace
        Array
            .from(document.querySelectorAll('code.editable'))
            .forEach(function (block) { 
                var cls = Array.from(block.classList);
                var langs = cls.filter(cl => cl.startsWith("language-"));
                var newLangs = langs.map(lang => "run-" + lang);
                langs.forEach(lang => block.classList.remove(lang));
                newLangs.forEach(newLang => block.classList.add(newLang));

                if(langs.length == 1) {
                    var lang = langs[0].replace("language-", "");
                    let editor = window.ace.edit(block);
                    editor.getSession().setMode("ace/mode/" + lang);

                    if(cls.includes('readonly')) {
                        editor.setReadOnly(true);
                    }

                    if(lang == "idris") {
                        configure_idris_editor(editor);
                    }
                }

                block.classList.add('hljs');
            });

        if(is_book_mode) {
            Array
                .from(document.querySelectorAll('code:not(.editable)'))
                .forEach(function (block) { hljs.highlightBlock(block); });
        }
    } else {
        if(is_book_mode) {
            Array
                .from(document.querySelectorAll('code'))
                .forEach(function (block) { hljs.highlightBlock(block); });
        }
    }

    // Adding the hljs class gives code blocks the color css
    // even if highlighting doesn't apply
    // Array
    //     .from(document.querySelectorAll('code'))
    //     .forEach(function (block) { block.classList.add('hljs'); });

    // Array.from(document.querySelectorAll('pre code')).forEach(function (block) {
    //     var pre_block = block.parentNode;
    //     if (!pre_block.classList.contains('playpen')) {
    //         var buttons = pre_block.querySelector(".buttons");
    //         if (!buttons) {
    //             buttons = document.createElement('div');
    //             buttons.className = 'buttons';
    //             pre_block.insertBefore(buttons, pre_block.firstChild);
    //         }

    //         var clipButton = document.createElement('button');
    //         clipButton.className = 'fa fa-copy clip-button';
    //         clipButton.title = 'Copy to clipboard';
    //         clipButton.setAttribute('aria-label', clipButton.title);
    //         clipButton.innerHTML = '<i class=\"tooltiptext\"></i>';

    //         buttons.insertBefore(clipButton, buttons.firstChild);
    //     }
    // });

    // Process playpen code blocks
    Array.from(document.querySelectorAll(".playpen")).forEach(function (pre_block) {

        var cls = Array.from(pre_block.classList);
        if(cls.includes("norun")) {
            return;
        }

        // Add play button
        var buttons = pre_block.querySelector(".buttons");
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            pre_block.insertBefore(buttons, pre_block.firstChild);
        }

        var lang = playpen_get_lang(pre_block);

        var faClass = 'fa-play';
        if(lang == "language-idris") {
            faClass = 'fa-check';
        }

        var runCodeButton = document.createElement('button');
        runCodeButton.className = `fa ${faClass} play-button`;
        runCodeButton.hidden = true;
        runCodeButton.title = 'Run this code';
        runCodeButton.setAttribute('aria-label', runCodeButton.title);

        buttons.insertBefore(runCodeButton, buttons.firstChild);

        if(lang !== undefined) {
            runCodeButton.addEventListener('click', function (e) {
                run_playpen_code(pre_block, lang);
            });
            runCodeButton.addEventListener('mousedown', function(e) {
                e.preventDefault();
            })
        }

    });
})();
