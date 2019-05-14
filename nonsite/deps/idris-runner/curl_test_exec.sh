#!/bin/bash
./curl_sh.sh 'export PATH=$PATH:/srv/.cabal/bin; idris --ibcsubdir /tmp/ibc test_pj.idr --codegen node -o /tmp/main.js; node /tmp/main.js'