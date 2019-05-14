#!/bin/bash

cd function
gcloud functions deploy idrisrunner --entry-point idrisrunner --runtime nodejs8 --trigger-http
# gcloud functions deploy idrisrunner --runtime python37 --trigger-http