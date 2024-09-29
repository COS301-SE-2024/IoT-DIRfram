#!/bin/bash

./start-e2e.sh &

#Wait for the servers to start
sleep 60

#run the tests
#/frontend and run npm run test:e2e
(cd ../../../frontend && npm run test:e2e)

#kill the servers
./end-e2e.sh


