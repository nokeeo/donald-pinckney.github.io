ace.define("ace/mode/idris_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        o = function() {
            this.$rules = {
                start: [{
                    token: [
                        "punctuation.definition.entity.idris",
                        "keyword.operator.function.infix.idris",
                        "punctuation.definition.entity.idris"
                    ],
                    regex: /(`)([\w']*?)(`)/,
                    comment: "Infix function application"
                }, {
                    token: [
                        "keyword.other.idris",
                        "meta.declaration.module.idris",
                        "meta.declaration.module.idris"
                    ],
                    regex: /^(module)(\s+)([a-zA-Z._']+)$/
                }, {
                    token: [
                        "keyword.other.idris",
                        "meta.import.idris",
                        "meta.import.idris"
                    ],
                    regex: /^(import)(\s+)([a-zA-Z._']+)$/
                }, {
                    token: "constant.numeric.float.idris",
                    regex: /\b(?:[0-9]+\.[0-9]+(?:[eE][+-]?[0-9]+)?|[0-9]+[eE][+-]?[0-9]+)\b/
                }, {
                    token: "constant.numeric.idris",
                    regex: /\b(?:[0-9]+|0(?:[xX][0-9a-fA-F]+|[oO][0-7]+))\b/
                }, {
                    token: "storage.modifier.export.idris",
                    regex: /^\b(?:public|abstract|private)\b/
                }, {
                    token: "storage.modifier.totality.idris",
                    regex: /\b(?:total|partial)\b/
                }, {
                    token: "storage.modifier.idris",
                    regex: /^\bimplicit\b/
                }, {
                    token: "punctuation.definition.string.begin.idris",
                    regex: /\"/,
                    push: [{
                        token: "punctuation.definition.string.end.idris",
                        regex: /\"/,
                        next: "pop"
                    }, {
                        include: "#escape_characters"
                    }, {
                        defaultToken: "string.quoted.double.idris"
                    }]
                }, {
                    token: "punctuation.definition.string.begin.idris",
                    regex: /((?!\w).{1}|^.{0,0})\'/,
                    push: [{
                        token: "punctuation.definition.string.end.idris",
                        regex: /\'/,
                        next: "pop"
                    }, {
                        include: "#escape_characters"
                    }, {
                        token: "invalid.illegal.idris",
                        regex: /$/
                    }, {
                        defaultToken: "string.quoted.single.idris"
                    }]
                }, {
                    token: "keyword.other.idris",
                    regex: /\bclass\b/,
                    push: [{
                        token: "keyword.other.idris",
                        regex: /\bwhere\b|$/,
                        next: "pop"
                    }, {
                        include: "#prelude_class"
                    }, {
                        include: "#prelude_type"
                    }, {
                        defaultToken: "meta.declaration.class.idris"
                    }]
                }, {
                    token: "keyword.other.idris",
                    regex: /\binstance\b/,
                    push: [{
                        token: "keyword.other.idris",
                        regex: /\bwhere\b|$/,
                        next: "pop"
                    }, {
                        include: "#prelude_class"
                    }, {
                        include: "#prelude_type"
                    }, {
                        include: "#context_signature"
                    }, {
                        include: "#type_signature"
                    }, {
                        defaultToken: "meta.declaration.instance.idris"
                    }]
                }, {
                    token: [
                        "keyword.other.idris",
                        "meta.declaration.data.idris",
                        "entity.name.type.idris",
                        "meta.declaration.data.idris",
                        "keyword.operator.colon.idris"
                    ],
                    regex: /\b(data)(\s+)([\w']+)(\s*)((?::)?)/,
                    push: [{
                        token: [
                            "keyword.other.idris",
                            "keyword.operator.idris"
                        ],
                        regex: /\b(where)\b|(=)/,
                        next: "pop"
                    }, {
                        include: "#type_signature"
                    }, {
                        defaultToken: "meta.declaration.data.idris"
                    }]
                }, {
                    include: "#function_signature"
                }, {
                    include: "#directive"
                }, {
                    include: "#comments"
                }, {
                    include: "#language_const"
                }, {
                    include: "#language_keyword"
                }, {
                    include: "#prelude"
                }, {
                    token: "constant.other.idris",
                    regex: /\b[A-Z][A-Za-z_'0-9]*/
                }, {
                    token: "keyword.operator.idris",
                    regex: /[|&!%$?~+:\-.=<\/>\\*]+/
                }, {
                    token: "punctuation.separator.comma.idris",
                    regex: /,/
                }],
                "#block_comment": [{
                    token: "punctuation.definition.comment.idris",
                    regex: /\{-(?!#)/,
                    push: [{
                        token: "punctuation.definition.comment.idris",
                        regex: /-\}/,
                        next: "pop"
                    }, {
                        include: "#block_comment"
                    }, {
                        defaultToken: "comment.block.idris"
                    }]
                }],
                "#comments": [{
                    token: [
                        "punctuation.definition.comment.idris",
                        "comment.line.double-dash.idris"
                    ],
                    regex: /(--)(.*$)/
                }, {
                    token: [
                        "punctuation.definition.comment.idris",
                        "comment.line.triple-bar.idris"
                    ],
                    regex: /(\|\|\|)(.*$)/
                }, {
                    include: "#block_comment"
                }],
                "#context_signature": [{
                    token: [
                        "entity.other.inherited-class.idris",
                        "entity.other.attribute-name.idris",
                        "meta.context-signature.idris",
                        "keyword.operator.double-arrow.idris"
                    ],
                    regex: /([\w._']+)((?:\s+[\w_']+)+)(\s*)(=>)/
                }, {
                    token: [
                        "punctuation.context.begin.idris",
                        "meta.context-signature.idris"
                    ],
                    regex: /(\()((?=.*\)\s*=>)|(?=[^)]*$))/,
                    push: [{
                        token: [
                            "punctuation.context.end.idris",
                            "meta.context-signature.idris",
                            "keyword.operator.double-arrow.idris"
                        ],
                        regex: /(\))(\s*)(=>)/,
                        next: "pop"
                    }, {
                        token: [
                            "entity.other.inherited-class.idris",
                            "meta.class-constraint.idris",
                            "entity.other.attribute-name.idris"
                        ],
                        regex: /([\w']+)(\s+)([\w']+)/
                    }, {
                        defaultToken: "meta.context-signature.idris"
                    }],
                    comment: "For things like '(Eq a, Show b) =>' It begins with '(' either followed by ') =>' on the same line, or anything but ')' until the end of line."
                }],
                "#directive": [{
                    token: [
                        "meta.directive.language-extension.idris",
                        "keyword.other.directive.idris",
                        "meta.directive.language-extension.idris",
                        "keyword.other.language-extension.idris"
                    ],
                    regex: /^(%)(language)(\s+)(.*)$/
                }, {
                    token: [
                        "meta.directive.totality.idris",
                        "keyword.other.directive.idris",
                        "meta.directive.totality.idris",
                        "keyword.other.totality.idris"
                    ],
                    regex: /^(%)(default)(\s+)(total|partial)$/
                }, {
                    token: [
                        "meta.directive.type-provider.idris",
                        "keyword.other.directive.idris",
                        "meta.directive.type-provider.idris",
                        "keyword.other.idris",
                        "meta.directive.type-provider.idris"
                    ],
                    regex: /^(%)(provide)(\s+.*\s+)(with)(\s+.*$)/
                }, {
                    token: [
                        "meta.directive.export.idris",
                        "keyword.other.directive.idris",
                        "meta.directive.export.idris",
                        "storage.modifier.export.idris"
                    ],
                    regex: /^(%)(access)(\s+)(public|abstract|private)$/
                }, {
                    token: [
                        "meta.directive.idris",
                        "keyword.other.directive.idris"
                    ],
                    regex: /^(%)([\w]+)\b/
                }],
                "#escape_characters": [{
                    token: "constant.character.escape.ascii.idris",
                    regex: /\\(?:NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|[abfnrtv\\\"'\&])/
                }, {
                    token: "constant.character.escape.octal.idris",
                    regex: /\\o[0-7]+|\\x[0-9A-Fa-f]+|\\[0-9]+/
                }, {
                    token: "constant.character.escape.control.idris",
                    regex: /\^[A-Z@\[\]\\\^_]/
                }],
                "#function_signature": [{
                    token: [
                        "entity.name.function.idris",
                        "meta.function.type-signature.idris",
                        "entity.name.function.idris",
                        "meta.function.type-signature.idris",
                        "meta.function.type-signature.idris",
                        "keyword.operator.colon.idris"
                    ],
                    regex: /(?:([\w']+)|(\()([|!%$+\-.,=<\/>:]+)(\)))(\s*)(:)(?!:)/,
                    push: [{
                        token: "meta.function.type-signature.idris",
                        // regex: /;|(?=--)|(?<=[^\s>])\s*(?!->)\s*$/,
                        regex: /;|(?=--)|(\s*(?!->)\s*$)/,
                        // regex: /a/,
                        next: "pop"
                    }, {
                        include: "#type_signature"
                    }, {
                        defaultToken: "meta.function.type-signature.idris"
                    }],
                    comment: "The end patterm is a bit tricky. It's either ';' or something, at the end of the line, but not '->', because a type signature can be multiline. Though, it doesn't help, if you break the signature before arrows."
                }],
                "#language_const": [{
                    token: "constant.language.unit.idris",
                    regex: /\(\)/
                }, {
                    token: "constant.language.bottom.idris",
                    regex: /_\|_|Void/
                }, {
                    token: "constant.language.underscore.idris",
                    regex: /\b_\b/
                }],
                "#language_keyword": [{
                    token: "keyword.other.idris",
                    regex: /\b(?:infix[lr]?|let|where|of|with)\b/,
                    comment: "I'm not sure that these are all keywords, but don't know where to check it"
                }, {
                    token: "keyword.control.idris",
                    regex: /\b(?:do|if|then|else|case|in)\b/
                }],
                "#parameter_type": [{
                    include: "#prelude_type"
                }, {
                    token: [
                        "meta.parameter.named.idris",
                        "entity.name.tag.idris",
                        "meta.parameter.named.idris"
                    ],
                    regex: /(\()([\w']+)(\s*:)(?!:)/,
                    push: [{
                        token: "meta.parameter.named.idris",
                        regex: /\)/,
                        next: "pop"
                    }, {
                        include: "#prelude_type"
                    }, {
                        defaultToken: "meta.parameter.named.idris"
                    }],
                    comment: "(x : Nat)"
                }, {
                    token: [
                        "meta.parameter.implicit.idris",
                        "storage.modifier.idris",
                        "entity.name.tag.idris",
                        "meta.parameter.implicit.idris"
                    ],
                    regex: /(\{)((?:(?:auto|default .+)\s+)?)([\w']+)(\s*:)(?!:)/,
                    push: [{
                        token: "meta.parameter.implicit.idris",
                        regex: /\}/,
                        next: "pop"
                    }, {
                        include: "#prelude_type"
                    }, {
                        defaultToken: "meta.parameter.implicit.idris"
                    }],
                    comment: "{auto p : a = b}"
                }],
                "#prelude": [{
                    include: "#prelude_class"
                }, {
                    include: "#prelude_type"
                }, {
                    include: "#prelude_function"
                }, {
                    include: "#prelude_const"
                }],
                "#prelude_class": [{
                    token: "support.class.prelude.idris",
                    regex: /\b(?:Eq|Ord|Num|MinBound|MaxBound|Integral|Applicative|Alternative|Cast|Foldable|Functor|Monad|Traversable|Uninhabited|Semigroup|VerifiedSemigroup|Monoid|VerifiedMonoid|Group|VerifiedGroup|AbelianGroup|VerifiedAbelianGroup|Ring|VerifiedRing|RingWithUnity|VerifiedRingWithUnity|JoinSemilattice|VerifiedJoinSemilattice|MeetSemilattice|VerifiedMeetSemilattice|BoundedJoinSemilattice|VerifiedBoundedJoinSemilattice|BoundedMeetSemilattice|VerifiedBoundedMeetSemilattice|Lattice|VerifiedLattice|BoundedLattice|VerifiedBoundedLattice)\b/,
                    comment: "These should be more or less all classes defined in Prelude (checked)"
                }],
                "#prelude_const": [{
                    token: "support.constant.prelude.idris",
                    regex: /\b(?:Just|Nothing|Left|Right|True|False|LT|EQ|GT|Refl)\b/
                }],
                "#prelude_function": [{
                    token: "support.function.prelude.idris",
                    regex: /\b(?:abs|acos|acosh|all|and|any|appendFile|applyM|asTypeOf|asin|asinh|atan|atan2|atanh|break|catch|ceiling|compare|concat|concatMap|const|cos|cosh|curry|cycle|decodeFloat|div|divMod|drop|dropWhile|elem|encodeFloat|enumFrom|enumFromThen|enumFromThenTo|enumFromTo|error|even|exp|exponent|fail|filter|flip|floatDigits|floatRadix|floatRange|floor|fmap|foldl|foldl1|foldr|foldr1|fromEnum|fromInteger|fromIntegral|fromRational|fst|gcd|getChar|getContents|getLine|head|id|init|interact|ioError|isDenormalized|isIEEE|isInfinite|isNaN|isNegativeZero|iterate|last|lcm|length|lex|lines|log|logBase|lookup|map|mapM|mapM_|max|maxBound|maximum|maybe|min|minBound|minimum|mod|negate|not|notElem|null|odd|or|otherwise|pi|pred|print|product|properFraction|putChar|putStr|putStrLn|quot|quotRem|read|readFile|readIO|readList|readLn|readParen|reads|readsPrec|realToFrac|recip|rem|repeat|replicate|return|reverse|round|scaleFloat|scanl|scanl1|scanr|scanr1|seq|sequence|sequence_|show|showChar|showList|showParen|showString|shows|showsPrec|significand|signum|sin|sinh|snd|span|splitAt|sqrt|subtract|succ|sum|tail|take|takeWhile|tan|tanh|toEnum|toInteger|toRational|truncate|uncurry|undefined|unlines|until|unwords|unzip|unzip3|userError|words|writeFile|zip|zip3|zipWith|zipWith3)\b/,
                    comment: "TODO review it; these are just Haskell prelude functions"
                }],
                "#prelude_type": [{
                    token: "support.type.prelude.idris",
                    regex: /\b(?:Type|Exists|World|IO|IntTy|FTy|Foreign|File|Mode|Dec|Bool|so|Ordering|Either|Fin|IsJust|List|Maybe|Nat|LTE|GTE|GT|LT|Stream|StrM|Vect|Not|Lazy|Inf|FalseElim)\b/,
                    comment: "These should be more or less all types defined in Prelude and some synonyms (checked)"
                }],
                "#type_signature": [{
                    include: "#context_signature"
                }, {
                    include: "#parameter_type"
                }, {
                    include: "#language_const"
                }, {
                    token: "keyword.operator.arrow.idris",
                    regex: /->/
                }]
            }, this.normalizeRules()
        };
    o.metaData = {
        fileTypes: ["idr"],
        // foldingStartMarker: "^.*\\bfn\\s*(\\w+\\s*)?\\([^\\)]*\\)(\\s*\\{[^\\}]*)?\\s*$",
        // foldingStopMarker: "^\\s*\\}",
        name: "Idris",
        scopeName: "source.idris"
    }, r.inherits(o, i), t.IdrisHighlightRules = o
}), ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function(e, t, n) {
    "use strict";
    // var r = e("../../lib/oop"),
    //     i = e("../../range").Range,
    //     s = e("./fold_mode").FoldMode,
    //     o = t.FoldMode = function(e) {
    //         e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)))
    //     };
    // r.inherits(o, s),
    //     function() {
    //         this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function(e, t, n) {
    //             var r = e.getLine(n);
    //             if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r)) return "";
    //             var i = this._getFoldWidgetBase(e, t, n);
    //             return !i && this.startRegionRe.test(r) ? "start" : i
    //         }, this.getFoldWidgetRange = function(e, t, n, r) {
    //             var i = e.getLine(n);
    //             if (this.startRegionRe.test(i)) return this.getCommentRegionBlock(e, i, n);
    //             var s = i.match(this.foldingStartMarker);
    //             if (s) {
    //                 var o = s.index;
    //                 if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
    //                 var u = e.getCommentFoldRange(n, o + s[0].length, 1);
    //                 return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != "all" && (u = null)), u
    //             }
    //             if (t === "markbegin") return;
    //             var s = i.match(this.foldingStopMarker);
    //             if (s) {
    //                 var o = s.index + s[0].length;
    //                 return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1)
    //             }
    //         }, this.getSectionRange = function(e, t) {
    //             var n = e.getLine(t),
    //                 r = n.search(/\S/),
    //                 s = t,
    //                 o = n.length;
    //             t += 1;
    //             var u = t,
    //                 a = e.getLength();
    //             while (++t < a) {
    //                 n = e.getLine(t);
    //                 var f = n.search(/\S/);
    //                 if (f === -1) continue;
    //                 if (r > f) break;
    //                 var l = this.getFoldWidgetRange(e, "all", t);
    //                 if (l) {
    //                     if (l.start.row <= s) break;
    //                     if (l.isMultiLine()) t = l.end.row;
    //                     else if (r == f) break
    //                 }
    //                 u = t
    //             }
    //             return new i(s, o, u, e.getLine(u).length)
    //         }, this.getCommentRegionBlock = function(e, t, n) {
    //             var r = t.search(/\s*$/),
    //                 s = e.getLength(),
    //                 o = n,
    //                 u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
    //                 a = 1;
    //             while (++n < s) {
    //                 t = e.getLine(n);
    //                 var f = u.exec(t);
    //                 if (!f) continue;
    //                 f[1] ? a-- : a++;
    //                 if (!a) break
    //             }
    //             var l = n;
    //             if (l > o) return new i(o, r, l, t.length)
    //         }
    //     }.call(o.prototype)
}), ace.define("ace/mode/idris", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/idrs_highlight_rules", "ace/mode/folding/cstyle"], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./idris_highlight_rules").IdrisHighlightRules,
        // o = e("./folding/cstyle").FoldMode,
        u = function() {
            this.HighlightRules = s, 
            // this.foldingRules = new o, 
            this.$behaviour = this.$defaultBehaviour
        };
    r.inherits(u, i),
        function() {
            this.lineCommentStart = "--", 
            this.blockComment = {
                start: "{-",
                end: "-}",
                nestable: !0
            }, this.$quotes = {
                '"': '"',
                '\'' : '\''
            }, this.$id = "ace/mode/idris"
        }.call(u.prototype), t.Mode = u
})