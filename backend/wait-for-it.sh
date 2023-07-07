#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

until STATUS=`curl -s -o /dev/null -w '%{http_code}' $host:8080/v1/.well-known/ready` && [ $STATUS -eq 200 ]; do
  >&2 echo "Service is unavailable - sleeping"
  sleep 1
done

>&2 echo "Service is up - executing command"
exec $cmd
