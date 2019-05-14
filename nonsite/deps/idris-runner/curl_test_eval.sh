#!/bin/bash
./curl_sh.sh 'export PATH=$PATH:/srv/.cabal/bin; idris --ibcsubdir /tmp/ibc test_p.idr -e test_main'