#!/bin/bash
export PATH=$PATH:/srv/.cabal/bin;
cd "$1"
idris --ibcsubdir /tmp/ibc -p contrib --port none -q $2 # purposefully do NOT quote so the args are splatted