#!/bin/sh

set -e

REDIS_SERVER=$REDIS_HOME"redis-server"

echo "***********   setup redis instances"

$REDIS_SERVER --port 6379 &
