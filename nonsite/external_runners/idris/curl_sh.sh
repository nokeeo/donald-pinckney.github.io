#!/bin/bash
curl -X POST https://us-central1-idrisrunner.cloudfunctions.net/idrisrunner -H "Content-Type:text/plain"  -d \
    "$1"