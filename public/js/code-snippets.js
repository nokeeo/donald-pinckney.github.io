"use strict";


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
    
    var language_dispatch_table = {
        "language-rust": run_rust_code,
        "language-idris": run_idris_code
    };

    function run_rust_code(code) {
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
    function run_idris_files(codeFiles) {
        var data = new FormData();
        for(const f of codeFiles) {
            data.append('files[]', f, f.name);
        }

        return fetch_with_timeout("https://us-central1-idrisrunner.cloudfunctions.net/idrisrunner", {
            method: 'POST',
            mode: 'cors',
            body: data
        }).then(response => response.text());
    }

    function run_idris_code(code) {
        // return Promise.resolve("Idris not yet implemented! " + code);

        var file1 = new File([code], "Main.idr", {
            type: "text/plain"
        });
        
        return run_idris_files([file1]);
    }

    function run_playpen_code(code_block, lang) {
        var result_block = code_block.querySelector(".result");
        if (!result_block) {
            result_block = document.createElement('code');
            result_block.className = 'result hljs language-bash';

            code_block.append(result_block);
        }

        let text = playpen_text(code_block);

        result_block.innerText = "Running...";

        var runFunc = language_dispatch_table[lang];
        if(runFunc === undefined) {
            result_block.innerText = "Error: can't run " + lang;
        } else {
            runFunc(text)
                .then(result => result_block.innerText = result)
                .catch(error => result_block.innerText = "Playground Communication: " + error.message);
        }
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

        var runCodeButton = document.createElement('button');
        runCodeButton.className = 'fa fa-play play-button';
        runCodeButton.hidden = true;
        runCodeButton.title = 'Run this code';
        runCodeButton.setAttribute('aria-label', runCodeButton.title);

        buttons.insertBefore(runCodeButton, buttons.firstChild);

        var lang = playpen_get_lang(pre_block);
        if(lang !== undefined) {
            runCodeButton.addEventListener('click', function (e) {
                run_playpen_code(pre_block, lang);
            });
        }

    });
})();
