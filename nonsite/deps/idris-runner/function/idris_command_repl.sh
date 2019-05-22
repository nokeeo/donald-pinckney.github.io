#!/bin/bash
export PATH=$PATH:/srv/.cabal/bin;
cd "$1"
# purposefully do NOT quote $2 so the args are splatted:
echo "$3" | idris --ibcsubdir /tmp/ibc --port none --nobanner -q $2 